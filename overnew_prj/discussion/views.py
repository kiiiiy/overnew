from django.shortcuts import render, get_object_or_404, redirect
from archive.models import *
from .models import * 
from django.contrib import messages
from .gemini_service import check_for_hate_speech 
from django.utils import timezone
from django.urls import reverse
from django.http import JsonResponse

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

        category_name = article.nc.nc_name if hasattr(article.nc, 'nc_name') else str(article.nc)
        source_name = article.media.media_name if hasattr(article.media, 'media_name') else str(article.media)
        image_url = getattr(article, 'thumbnail_url', '')  # 썸네일 필드명에 맞게 바꿔줘
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
    categories = NewsCategory.objects.all().order_by('nc_id')
    return render(request, 'discussion/community.html', {
        'categories': categories,
    })

def discussion_list(request, nc_id=1):
    categories = NewsCategory.objects.all().order_by('nc_id')
    selected_category = get_object_or_404(NewsCategory, pk=nc_id)

    now = timezone.now()

    rooms = (
        DiscussionRoom.objects
        .filter(
            article__nc=selected_category,
            is_anonymous=False,
            start_time__lte=now,   # 시작은 됐고
            finish_time__gte=now,  # 아직 안 끝난 방만
        )
        .select_related('article', 'article__media')
        .order_by('-room_id')
    )

    context = {
        'categories': categories,
        'selected_category': selected_category,
        'rooms': rooms,
    }
    return render(request, 'discussion/discussion-realname.html', context)


def anonymous_list(request, nc_id=1):
    categories = NewsCategory.objects.all().order_by('nc_id')
    selected_category = get_object_or_404(NewsCategory, pk=nc_id)

    now = timezone.now()

    rooms = (
        DiscussionRoom.objects
        .filter(
            article__nc=selected_category,
            is_anonymous=True,
            start_time__lte=now,
            finish_time__gte=now,
        )
        .select_related('article', 'article__media')
        .order_by('-room_id')
    )

    context = {
        'categories': categories,
        'selected_category': selected_category,
        'rooms': rooms,
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

    context = {
        'room': room,
    }
    return render(request, 'discussion/discussion_detail.html', context)


def anonymous_detail(request, room_id):
    room = get_object_or_404(
        DiscussionRoom.objects.select_related(
            'article__media__mc',
            'article__nc'
        ),
        pk=room_id,
        is_anonymous=True,
    )

    context = {
        'room': room,
    }
    return render(request, 'discussion/discussion-article-detail.html', context)


def create_comment(request, room_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)

    # 토론 기간 체크
    now = timezone.now()
    if not (room.start_time <= now <= room.finish_time):
        # 토론 종료된 방이면 댓글 막기
        messages.error(request, "토론 기간이 종료되어 댓글을 작성할 수 없습니다.")
        return redirect('discussion:discussion_detail', room_id=room_id)

    if request.method == 'POST':
        content = request.POST.get('content', '').strip()
        is_anonymous = request.POST.get('is_anonymous') == 'on'
        parent_id = request.POST.get('parent_id')

        parent = None
        if parent_id:
            parent = get_object_or_404(Comment, pk=parent_id, room=room)

        if content:
            # 1. 댓글을 먼저 저장합니다. (사용자가 등록 성공을 바로 확인하도록)
            new_comment = Comment.objects.create(
                room=room,
                user=request.user,
                comment_content=content,
                parent=parent,
            )

            # 2. ⭐️ [핵심] Gemini API를 사용하여 비하적 의도 필터링을 수행합니다.
            needs_filtering = check_for_hate_speech(content)
            
            if needs_filtering:
                # 3. 비하적 의도가 감지된 경우, 댓글 내용을 필터링 메시지로 업데이트하고 저장합니다.
                filter_message = "AI가 비하적 의도를 감지해 필터링했어요."
                new_comment.comment_content = filter_message
                new_comment.save(update_fields=['comment_content'])
                
                # 경고 메시지를 사용자에게 표시
                messages.warning(
                    request, 
                    f"댓글 내용에 비하적 의도가 포함되어, 내용이 '{filter_message}'로 대체되었습니다."
                )
            else:
                # 필터링을 통과한 경우, 성공 메시지 표시
                messages.success(request, "댓글이 성공적으로 등록되었습니다.")

        return redirect('discussion:discussion_detail', room_id=room_id)

    return redirect('discussion:discussion_detail', room_id=room_id)


def delete_comment(request, room_id, comment_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)
    comment = get_object_or_404(Comment, pk=comment_id, room=room, user=request.user)
    comment.delete()
    
    return redirect('discussion:discussion_detail', room_id=room_id)


def toggle_bookmark(request, room_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)
    user = request.user

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