# feed/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Count

from archive.models import *
from users.models import *

from django.http import JsonResponse


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


TOPIC_TO_CATEGORY_NAME = {
    'politics': '정치',
    'economy': '경제',
    'society': '사회',
    'culture': '생활/문화',
    'it': 'IT/과학',
    'world': '세계',
    'enter': '연예',
    'sport': '스포츠',
}

def hot_feed_api(request):
    topic = request.GET.get('topic')  # 'politics', 'economy' 같은 값

    qs = (
        Article.objects
        .select_related('media', 'nc')
        .annotate(like_count=Count('likes'))
        .order_by('-like_count', '-created_at')
    )

    # topic으로 필터 (선택)
    if topic and topic in TOPIC_TO_CATEGORY_NAME:
        qs = qs.filter(nc__news_category=TOPIC_TO_CATEGORY_NAME[topic])

    qs = qs[:20]  # 상위 20개만

    def format_time(article):
        # 일단 간단하게 날짜 문자열로
        return article.created_at.strftime('%Y-%m-%d %H:%M')

    articles = []
    for a in qs:
        articles.append({
            "id": a.article_id,
            "category": a.nc.news_category if a.nc else "",
            "source": a.media.media_name if a.media else "",
            "title": a.title,
            "views": a.view_count,     # 프론트에서 '42.9k'로 포맷하고 싶으면 JS에서 처리
            "time": format_time(a),
            "image": a.image or "https://via.placeholder.com/100x60",
        })

    return JsonResponse({"articles": articles})


@login_required
def following_feed_api(request):
    topic = request.GET.get('topic')  # 'politics' 등

    category_name = TOPIC_TO_CATEGORY_NAME.get(topic)

    # 내가 팔로우한 사람들 ID
    following_ids = Following.objects.filter(
        user=request.user
    ).values_list('user2_id', flat=True)

    scraps = (
        Scrap.objects
        .select_related('user', 'news', 'news__media', 'news__nc')
        .filter(user_id__in=following_ids)
        .order_by('-created_at')
    )

    if category_name:
        scraps = scraps.filter(news__nc__news_category=category_name)

    results = []

    for s in scraps:
        u = s.user
        a = s.news

        results.append({
            "user": {
                "id": u.id,
                "nickname": u.nickname or u.username,
                "profile_image": u.profile_image.url if u.profile_image else "",
            },
            "article": {
                "id": a.article_id,
                "category": a.nc.news_category if a.nc else "",
                "source": a.media.media_name if a.media else "",
                "title": a.title,
                "views": a.view_count,
                "time": a.created_at.strftime('%Y-%m-%d %H:%M'),
                "image": a.image or "https://via.placeholder.com/100x60",
            }
        })

    return JsonResponse({"results": results})