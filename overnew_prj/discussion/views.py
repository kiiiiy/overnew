# discussion/views.py
from django.shortcuts import render, get_object_or_404, redirect
from archive.models import *
from .models import * 
from django.contrib.auth.decorators import login_required
from django.contrib import messages


def main(request):
    return render(request, 'discussion/main.html')

def discussion_list(request, nc_id=1):
    categories = NewsCategory.objects.all().order_by('nc_id')
    selected_category = get_object_or_404(NewsCategory, pk=nc_id)

    now = timezone.now()

    rooms = (
        DiscussionRoom.objects
        .filter(
            article__nc=selected_category,
            is_anoymous=False,
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
    return render(request, 'discussion/discussion_list.html', context)


def anonymous_list(request, nc_id=1):
    categories = NewsCategory.objects.all().order_by('nc_id')
    selected_category = get_object_or_404(NewsCategory, pk=nc_id)

    now = timezone.now()

    rooms = (
        DiscussionRoom.objects
        .filter(
            article__nc=selected_category,
            is_anoymous=True,
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
    return render(request, 'discussion/anonymous_list.html', context)

def discussion_detail(request, room_id):
    room = get_object_or_404(
        DiscussionRoom.objects.select_related(
            'article__media__mc',
            'article__nc'
        ),
        pk=room_id,
        is_anoymous=False,
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
        is_anoymous=True,
    )

    context = {
        'room': room,
    }
    return render(request, 'discussion/anonymous_detail.html', context)

@login_required
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
            Comment.objects.create(
                room=room,
                user=request.user,
                comment_content=content,
                parent=parent,
                is_anonymous=is_anonymous, 
            )

        return redirect('discussion:discussion_detail', room_id=room_id)

    return redirect('discussion:discussion_detail', room_id=room_id)


@login_required
def delete_comment(request, room_id, comment_id):
    room = get_object_or_404(DiscussionRoom, pk=room_id)
    comment = get_object_or_404(Comment, pk=comment_id, room=room, user=request.user)
    comment.delete()
    
    return redirect('discussion:discussion_detail', room_id=room_id)
