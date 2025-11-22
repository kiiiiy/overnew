import json

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_POST
from account.models import *
from archive.models import *
from .models import *
from .gemini_service import check_for_hate_speech


@receiver(post_save, sender=Article)
def create_discussion_rooms_for_article(sender, instance, created, **kwargs):
    """
    Article 이 처음 생성될 때
    - 실명방 (is_anonymous=False)
    - 익명방 (is_anonymous=True)
    둘 다 자동으로 만들어 준다
    """
    if not created:
        return

    for is_anonymous in (False, True):
        DiscussionRoom.objects.get_or_create(
            article=instance,
            is_anonymous=is_anonymous,
        )


def choose_mode(request, article_id):
    """
    기사 1개 기준으로:
    - 실명 토론방
    - 익명 토론방
    중 어디로 들어갈지 선택하는 페이지
    """
    article = get_object_or_404(Article, pk=article_id)

    real_room = DiscussionRoom.objects.filter(
        article=article,
        is_anonymous=False,
    ).first()

    anon_room = DiscussionRoom.objects.filter(
        article=article,
        is_anonymous=True,
    ).first()

    return render(request, "discussion/discussion-detail.html", {
        "article": article,
        "real_room": real_room,
        "anon_room": anon_room,
    })


def get_time_left_label(finish_time):
    now = timezone.now()
    diff = finish_time - now
    seconds = diff.total_seconds()

    if seconds <= 0:
        return "종료된 토론입니다."

    minutes = int(seconds // 60)
    hours = minutes // 60
    days = hours // 24

    if days > 0:
        return f"{days}일 {hours % 24}시간 남음"
    elif hours > 0:
        return f"{hours}시간 {minutes % 60}분 남음"
    else:
        return f"{minutes}분 남음"


def api_room_list(request):
    """
    ?nc_id=1 로 오면,
    해당 카테고리의 '실명 토론방' 기준으로
    기사당 1개씩 카드 데이터를 내려준다.
    (익명방은 choose_mode 화면에서만 사용)
    """
    nc_id = request.GET.get('nc_id')
    if not nc_id:
        return JsonResponse({'rooms': []})

    now = timezone.now()

    # 🔥 실명방(is_anonymous=False)만 가져오기 → 기사당 1개 카드
    rooms = (
        DiscussionRoom.objects
        .filter(
            article__nc_id=nc_id,
            is_anonymous=False,
            start_time__lte=now,
            finish_time__gte=now,
        )
        .select_related('article', 'article__media', 'article__nc')
        .order_by('-room_id')
    )

    data = []
    for room in rooms:
        article = room.article

        # ArchiveCategory, Media 모델 필드명에 맞게 정리
        category_name = getattr(article.nc, 'news_category', str(article.nc))
        source_name = getattr(article.media, 'media_name', str(article.media))
        image_url = getattr(article, 'image', '')
        views_count = getattr(article, 'view_count', 0)

        # 좋아요 / 댓글 수
        likes_count = getattr(article, 'like_count', 0) if hasattr(article, 'like_count') \
            else article.likes.count() if hasattr(article, 'likes') else 0
        comments_count = room.comment_set.count()

        # 남은 시간 라벨 (백에서 한 번 계산해서 내려주자)
        time_label = get_time_left_label(room.finish_time)

        # 🔹 실명/익명 선택 페이지로 가는 URL
        enter_url = reverse('discussion:choose_mode', args=[article.article_id])

        data.append({
            'id': room.room_id,
            'article_id': article.article_id,
            'type': 'realname',
            'category': category_name,
            'source': source_name,
            'title': article.title,
            'image': image_url,
            'time': time_label,
            'time_end': room.finish_time.isoformat(),
            'views': views_count,
            'likes': likes_count,
            'comments': comments_count,
            'enter_url': enter_url,
            'article_url': article.url,
        })

    return JsonResponse({'rooms': data})


def discussion_list(request):
    categories = ArchiveCategory.objects.all().order_by('pk')
    return render(request, 'discussion/community.html', {
        'categories': categories,
    })


def main(request):
    # id 대신 pk 또는 nc_id 사용
    categories = ArchiveCategory.objects.all().order_by('pk')
    # 또는 categories = ArchiveCategory.objects.all().order_by('nc_id')

    return render(request, 'discussion/community.html', {
        'categories': categories,
    })


# ============================== 댓글 트리 빌더 ==============================


def build_comment_tree(comments_qs, user=None):
    # 현재 로그인한 유저가 누른 좋아요 목록
    liked_ids = set()
    if user is not None and user.is_authenticated:
        liked_ids = set(
            CommentLike.objects
            .filter(user=user, comment__in=comments_qs)
            .values_list('comment_id', flat=True)
        )

    by_id = {}
    for c in comments_qs:
        pk = c.pk

        user_obj = getattr(c, "user", None)
        user_pk = getattr(c, "user_id", None)

        if user_obj is not None:
            display_name = (
                getattr(user_obj, "nickname", None)
                or getattr(user_obj, "username", None)
                or str(user_obj)
            )
        else:
            display_name = "알 수 없음"

        by_id[pk] = {
            "id": pk,
            "userId": user_pk,
            "display_name": display_name,
            "date": c.created_at.strftime("%b %d, %Y"),
            "text": c.comment_content,
            "likes": c.likes.count(),
            "is_liked": (pk in liked_ids),
            "replies": [],
            "parent_id": getattr(c, "parent_id", None),  # 🔥 여기서 parent_id 기록
            "created_at": c.created_at.isoformat(),
        }


    roots = []

    # 부모-자식 연결
    for c in comments_qs:
        pk = c.pk
        data = by_id[pk]
        parent_pk = getattr(c, "parent_id", None)

        if parent_pk and parent_pk in by_id:
            by_id[parent_pk]["replies"].append(data)
        else:
            roots.append(data)

    # parent_id는 JS에 필요 없으니 제거
    def strip_parent_id(node):
        node.pop("parent_id", None)
        for child in node["replies"]:
            strip_parent_id(child)

    for r in roots:
        strip_parent_id(r)

    return roots


# ============================== 상세 페이지들 ==============================


def anonymous_detail(request, room_id):
    room = get_object_or_404(
        DiscussionRoom.objects.select_related(
            'article__media',   # 🔧 여기 수정
            'article__nc'
        ),
        pk=room_id,
        is_anonymous=True,
    )

    comments_qs = room.comment_set.all().order_by('created_at')

    participant_count = comments_qs.values_list('user_id', flat=True).distinct().count()
    time_left_label = get_time_left_label(room.finish_time)

    if request.user.is_authenticated:
        is_bookmarked = room.bookmark.filter(pk=request.user.pk).exists()
    else:
        is_bookmarked = False

    comments_tree = build_comment_tree(comments_qs, request.user)
    comments_json = json.dumps(comments_tree, cls=DjangoJSONEncoder, ensure_ascii=False)

    context = {
        'room': room,
        'comments': comments_qs,
        'comments_json': comments_json,
        'participant_count': participant_count,
        'is_bookmarked': is_bookmarked,
        'time_left_label': time_left_label,
    }
    return render(request, 'discussion/discussion-anonymous.html', context)




def discussion_detail(request, room_id):
    room = get_object_or_404(
        DiscussionRoom.objects.select_related(
            'article__media',   # 🔧 여기 수정
            'article__nc'
        ),
        pk=room_id,
        is_anonymous=False,
    )

    comments_qs = room.comment_set.all().order_by('created_at')

    participant_count = comments_qs.values_list('user_id', flat=True).distinct().count()
    time_left_label = get_time_left_label(room.finish_time)

    if request.user.is_authenticated:
        is_bookmarked = room.bookmark.filter(pk=request.user.pk).exists()
    else:
        is_bookmarked = False

    comments_tree = build_comment_tree(comments_qs, request.user)
    comments_json = json.dumps(comments_tree, cls=DjangoJSONEncoder, ensure_ascii=False)

    context = {
        'room': room,
        'comments': comments_qs,
        'comments_json': comments_json,
        'participant_count': participant_count,
        'is_bookmarked': is_bookmarked,
        'time_left_label': time_left_label,
    }
    return render(request, 'discussion/discussion-realname.html', context)


# ============================== 댓글 생성 / 삭제 ==============================


def create_comment(request, room_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)

    # 토론 기간 체크
    now = timezone.now()
    if not (room.start_time <= now <= room.finish_time):
        messages.error(request, "토론 기간이 종료되어 댓글을 작성할 수 없습니다.")
        if room.is_anonymous:
            return redirect('discussion:anonymous_detail', room_id=room_id)
        else:
            return redirect('discussion:discussion_detail', room_id=room_id)

    if request.method == 'POST':
        content = request.POST.get('content', '').strip()
        parent_id = request.POST.get('parent_id')  # 🔥 여기서 받음
        parent = None

        if parent_id:
            try:
                # 'c3' 같은 값도 올 수 있어서 숫자만 추출
                pure_id = int(str(parent_id).lstrip('c'))
                parent = get_object_or_404(Comment, pk=pure_id, room=room)
            except (ValueError, Comment.DoesNotExist):
                parent = None

        if content:
            new_comment = Comment.objects.create(
                room=room,
                user=request.user if request.user.is_authenticated else None,
                comment_content=content,
                parent=parent,   # 🔥 여기!
            )

            needs_filtering = check_for_hate_speech(content)
            if needs_filtering:
                filter_message = "AI가 비하적 의도를 감지해 필터링했어요."
                new_comment.comment_content = filter_message
                new_comment.save(update_fields=['comment_content'])
                messages.warning(
                    request,
                    f"댓글 내용에 비하적 의도가 포함되어, 내용이 '{filter_message}'로 대체되었습니다."
                )
            else:
                messages.success(request, "댓글이 성공적으로 등록되었습니다.")

    if room.is_anonymous:
        return redirect('discussion:anonymous_detail', room_id=room_id)
    else:
        return redirect('discussion:discussion_detail', room_id=room_id)


def delete_comment(request, room_id, comment_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)

    # 🔐 로그인 체크
    if not request.user.is_authenticated:
        messages.error(request, "댓글을 삭제하려면 로그인이 필요합니다.")
        if room.is_anonymous:
            return redirect('discussion:anonymous_detail', room_id=room_id)
        else:
            return redirect('discussion:discussion_detail', room_id=room_id)

    comment = get_object_or_404(Comment, pk=comment_id, room=room, user=request.user)
    comment.delete()
    messages.info(request, "댓글이 삭제되었습니다.")

    if room.is_anonymous:
        return redirect('discussion:anonymous_detail', room_id=room_id)
    else:
        return redirect('discussion:discussion_detail', room_id=room_id)


# ============================== 북마크 토글 ==============================


def toggle_bookmark(request, room_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)
    user = request.user

    # 🔐 로그인 체크
    if not user.is_authenticated:
        messages.error(request, "북마크를 사용하려면 로그인이 필요합니다.")
        if room.is_anonymous:
            return redirect('discussion:anonymous_detail', room_id=room_id)
        else:
            return redirect('discussion:discussion_detail', room_id=room_id)

    if user in room.bookmark.all():
        room.bookmark.remove(user)
        messages.info(request, "북마크를 해제했어요.")
    else:
        room.bookmark.add(user)
        messages.success(request, "북마크에 추가했어요.")

    if room.is_anonymous:
        return redirect('discussion:anonymous_detail', room_id=room_id)
    else:
        return redirect('discussion:discussion_detail', room_id=room_id)


# ============================== 댓글 좋아요 토글 ==============================


@require_POST
def toggle_comment_like(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)

    like, created = CommentLike.objects.get_or_create(
        user=request.user,
        comment=comment,
    )

    if created:
        liked = True
    else:
        like.delete()
        liked = False

    like_count = comment.likes.count()

    return JsonResponse({
        "liked": liked,
        "like_count": like_count,
        "comment_id": comment_id,
    })
