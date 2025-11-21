#archive/views.py
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt

from .models import User, Article, NewsCategory, Scrap, Media
from .utils import fetch_article_metadata
from django.shortcuts import render
<<<<<<< HEAD
from .models import *
# Create your views here.

=======



def get_user_or_404(user_id: int) -> User:
    try:
        return User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        raise ValueError("존재하지 않는 사용자입니다.")


@csrf_exempt
@require_POST
def upload_article(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON 형식이 아닙니다."}, status=400)

    user_id = data.get("user_id")
    url = data.get("url")
    nc_id = data.get("nc_id")
    media_id = data.get("media_id")
    media_name = data.get("media_name")

    if not user_id or not url or not nc_id:
        return JsonResponse({"error": "user_id, url, nc_id는 필수입니다."}, status=400)

    #유저
    try:
        user = get_user_or_404(user_id)
    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=404)

    #카테고리
    try:
        category = NewsCategory.objects.get(nc_id=nc_id)
    except NewsCategory.DoesNotExist:
        return JsonResponse({"error": "존재하지 않는 카테고리입니다."}, status=400)

    #언론사
    media = None
    if media_id:
        try:
            media = Media.objects.get(media_id=media_id)
        except Media.DoesNotExist:
            return JsonResponse({"error": "존재하지 않는 언론사입니다."}, status=400)
    elif media_name:
        media, _ = Media.objects.get_or_create(name=media_name)

    #1) 메타데이터 크롤링
    try:
        meta = fetch_article_metadata(url)
    except Exception as e:
        return JsonResponse({"error": f"메타데이터 수집 실패: {e}"}, status=500)

    #2) Article 생성 or 가져오기
    article, created = Article.objects.get_or_create(
        url=url,
        defaults={
            "title": meta["title"],
            "summary": meta["summary"],
            "image": meta["image"],
            "nc": category,
            "media": media,
        },
    )

    #3) 유저 스크랩 기록
    Scrap.objects.get_or_create(
        user=user,
        news=article,
    )

    #4) 응답 – 아카이브 카드 한 개에 필요한 정보
    return JsonResponse({
        "article_id": article.article_id,
        "title": article.title,
        "summary": article.summary,
        "image": article.image,
        "category": article.nc.news_category if article.nc else "",
        "media": article.media.name if article.media else "",
        "url": article.url,
        "created": created,
    })

# --- 스크랩 리스트 API ---
@require_GET
def scrap_list(request, user_id: int):
    """
    GET /api/users/<user_id>/scraps/
    """
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "해당 사용자를 찾을 수 없습니다"}, status=404)

    qs = (
        Scrap.objects
        .filter(user=user)
        .select_related("news", "news__nc", "news__media")
        .order_by("-created_at")
    )

    data = [
        {
            "article_id": s.news.article_id,
            "title": s.news.title,
            "summary": s.news.summary,
            "image": s.news.image,
            "category": s.news.nc.news_category if s.news.nc else "",
            "media": s.news.media.name if s.news.media else "",
            "url": s.news.url,
            "scraped_at": s.created_at.isoformat(),
        }
        for s in qs
    ]

    return JsonResponse(data, safe=False)

def ping(request):
    return HttpResponse("archive API OK")

def archive_main(request):
    return render(request, "archive/archive.html")

def article_detail(request):
    return render(request, "archive/article-detail.html")

def create_scrap(request):
    return render(request, "archive/create-scrap.html")

def profile_detail(request):
    return render(request, "archive/profile-detail.html")
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
