# feed/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Count

from archive.models import Article, Like, NewsCategory, UserNews
from users.models import Following


# 기본 피드: 일단 HOT 이랑 비슷하게 전체 기사 보여주게
def feed(request):
    articles = (
        Article.objects
        .annotate(like_count=Count('likes'))
        .order_by('-created_at')
    )
    return render(request, 'feed/feed.html', {
        'mode': 'all',       # 탭 표시용
        'articles': articles,
    })


# 🔥 HOT 탭: 좋아요 50개 이상
def hot_feed(request):
    # 옵션: ?category=1 같이 들어오면 분야별 필터
    category_id = request.GET.get('category')

    articles = (
        Article.objects
        .annotate(like_count=Count('likes'))
        .order_by('-like_count', '-created_at')
    )

    if category_id:
        articles = articles.filter(nc_id=category_id)

    # 상단 카테고리 칩 (전체 분야)
    categories = NewsCategory.objects.all()

    return render(request, 'feed/feed.html', {
        'mode': 'hot',
        'articles': articles.filter(like_count__gte=50),
        'categories': categories,
        'selected_category_id': int(category_id) if category_id else None,
    })


@login_required
def following_feed(request):
    category_id = request.GET.get('category')

    # 내가 팔로우한 사람 목록 (user2가 팔로잉 대상)
    following_ids = Following.objects.filter(
        user=request.user
    ).values_list('user2', flat=True)

    # 팔로우한 사람들이 '작성한' 기사만 가져오기
    articles = (
        Article.objects
        .filter(author_id__in=following_ids)
        .annotate(like_count=Count('likes'))
        .order_by('-created_at')
    )

    # 카테고리 필터 적용
    if category_id:
        articles = articles.filter(nc_id=category_id)

    # 카테고리 칩
    categories = NewsCategory.objects.all()

    return render(request, 'feed/feed.html', {
        'mode': 'following',
        'articles': articles,
        'categories': categories,
        'selected_category_id': int(category_id) if category_id else None,
    })