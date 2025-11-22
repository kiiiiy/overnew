import json

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.urls import reverse
from django.utils import timezone
from django.contrib import messages
from django.core.serializers.json import DjangoJSONEncoder

from archive.models import *
from .models import *
from .gemini_service import check_for_hate_speech


def api_room_list(request):
    """
    ?nc_id=1 같은 식으로 요청 오면
    해당 카테고리의 진행 중인 토론방 리스트를 JSON으로 내려줌
    """
    nc_id = request.GET.get('nc_id')
    if not nc_id:
        return JsonResponse({'rooms': []})

    now = timezone.now()

    rooms = (
        DiscussionRoom.objects
        .filter(
            article__nc_id=nc_id,
            start_time__lte=now,
            finish_time__gte=now,
        )
        .select_related('article', 'article__media', 'article__nc')
        .order_by('-room_id')
    )

    data = []
    for room in rooms:
        article = room.article

        category_name = getattr(article.nc, 'nc_name', str(article.nc))
        source_name = getattr(article.media, 'media_name', str(article.media))
        image_url = getattr(article, 'thumbnail_url', '')  # 썸네일 필드명에 맞게 수정
        views_count = getattr(article, 'view_count', 0)
        likes_count = getattr(article, 'like_count', 0) if hasattr(article, 'like_count') \
            else article.likes.count() if hasattr(article, 'likes') else 0
        comments_count = room.comment_set.count()

        detail_url = reverse(
            'discussion:anonymous_detail' if room.is_anonymous else 'discussion:discussion_detail',
            args=[room.room_id]
        )

        # article detail url 도 있으면 같이 내려주기
        try:
            article_url = reverse('archive:article_detail', args=[article.article_id])
        except Exception:
            article_url = ''

        data.append({
            'id': room.room_id,
            'type': 'anonymous' if room.is_anonymous else 'realname',
            'category': category_name,
            'source': source_name,
            'title': article.title,
            'image': image_url,
            'time_end': room.finish_time.isoformat(),
            'views': views_count,
            'likes': likes_count,
            'comments': comments_count,
            'detail_url': detail_url,
            'article_url': article_url,
        })

    return JsonResponse({'rooms': data})


def main(request):
    """
    필요하면 메인 페이지에서 특정 room_id로 redirect 하거나
    리스트 페이지로 보내는 용도로 사용
    """
    return render(request, 'discussion/discussion-detail.html')


# ============================== 댓글 트리 빌더 ==============================

def build_comment_tree(comments_qs):
    """
    Comment 쿼리셋을 JS에서 쓰던 형태로 변환:
    {
      id: 'c1',
      userId: 'user1',
      date: 'Aug 19, 2021',
      text: '내용',
      likes: 0,
      replies: [ ... ]
    }
    """
    by_id = {}
    for c in comments_qs:
        pk = c.pk  # ✅ PK는 항상 .pk 로 접근
        by_id[pk] = {
            "id": f"c{pk}",                  # JS에서 쓰는 id (문자열)
            "userId": f"user{c.user.pk}",    # 유저도 pk 기준
            "date": c.created_at.strftime("%b %d, %Y"),  # 예: Aug 19, 2021
            "text": c.comment_content,
            "likes": 0,   # 나중에 좋아요 모델 붙이면 수정
            "replies": [],
            "parent_id": getattr(c, "parent_id", None),  # FK면 parent_id 자동 생성됨
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
            'article__media__mc',
            'article__nc'
        ),
        pk=room_id,
        is_anonymous=True,
    )

    comments_qs = room.comment_set.all().order_by('created_at')

 
    participant_count = comments_qs.values_list('user_id', flat=True).distinct().count()


    comments_tree = build_comment_tree(comments_qs)
    comments_json = json.dumps(comments_tree, cls=DjangoJSONEncoder, ensure_ascii=False)

    context = {
        'room': room,
        'comments': comments_qs,          
        'comments_json': comments_json,   
        'participant_count': participant_count,  
    }
    return render(request, 'discussion/discussion-anonymous.html', context)



def discussion_detail(request, room_id):
    room = get_object_or_404(
        DiscussionRoom.objects.select_related(
            'article__media__mc',
            'article__nc'
        ),
        pk=room_id,
        is_anonymous=False,
    )

    # 실명방도 댓글 트리 쓰고 싶으면 동일하게 적용 가능
    comments_qs = room.comment_set.all().order_by('created_at')
    comments_tree = build_comment_tree(comments_qs)
    comments_json = json.dumps(comments_tree, cls=DjangoJSONEncoder, ensure_ascii=False)

    context = {
        'room': room,
        'comments': comments_qs,
        'comments_json': comments_json,
    }
    return render(request, 'discussion/discussion-realname.html', context)


# ============================== 댓글 생성 / 삭제 ==============================

def create_comment(request, room_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)

    # 🔐 로그인 체크
    if not request.user.is_authenticated:
        messages.error(request, "댓글을 작성하려면 로그인이 필요합니다.")
        if room.is_anonymous:
            return redirect('discussion:anonymous_detail', room_id=room_id)
        else:
            return redirect('discussion:discussion_detail', room_id=room_id)

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
        parent_id = request.POST.get('parent_id')
        parent = None

        if parent_id:
            # parent_id는 'c3' 같이 올 수 있으므로 숫자만 추출
            try:
                pure_id = int(str(parent_id).lstrip('c'))
                parent = get_object_or_404(Comment, pk=pure_id, room=room)
            except ValueError:
                parent = None

        if content:
            new_comment = Comment.objects.create(
                room=room,
                user=request.user,
                comment_content=content,
                parent=parent,
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
