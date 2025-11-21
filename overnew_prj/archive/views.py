# archive/views.py

import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.apps import apps # 👈 새로 추가: 모델을 안전하게 가져오기 위해 필요

# -------------------------------------------------------------
# ❌ 이 줄을 제거합니다. (순환 임포트의 주 원인)
# from .models import Article, Scrap, ArchiveCategory, ArchiveMedia 
# -------------------------------------------------------------

from .utils import fetch_article_metadata

User = get_user_model() 


def get_user_or_404(user_id: int):
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
    
    # 🌟 순환 임포트 해결을 위해 함수 내부에서 모델을 로드합니다.
    try:
        ArchiveCategory = apps.get_model('archive', 'ArchiveCategory')
        ArchiveMedia = apps.get_model('archive', 'ArchiveMedia')
        Article = apps.get_model('archive', 'Article')
        Scrap = apps.get_model('archive', 'Scrap')
    except LookupError as e:
        return JsonResponse({"error": f"모델 로드 실패: {e}"}, status=500)


    #유저
    try:
        user = get_user_or_404(user_id)
    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=404)

    #카테고리
    try:
        # 🌟 수정: ArchiveCategory 사용
        category = ArchiveCategory.objects.get(nc_id=nc_id)
    except ArchiveCategory.DoesNotExist:
        return JsonResponse({"error": "존재하지 않는 카테고리입니다."}, status=400)

    #언론사
    media = None
    if media_id:
        try:
            # 🌟 수정: ArchiveMedia 사용
            media = ArchiveMedia.objects.get(media_id=media_id)
        except ArchiveMedia.DoesNotExist:
            return JsonResponse({"error": "존재하지 않는 언론사입니다."}, status=400)
    elif media_name:
        # 🌟 수정: ArchiveMedia 사용
        media, _ = ArchiveMedia.objects.get_or_create(name=media_name)

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
    # 🌟 순환 임포트 해결을 위해 함수 내부에서 모델을 로드합니다.
    try:
        Article = apps.get_model('archive', 'Article')
        Scrap = apps.get_model('archive', 'Scrap')
        User = get_user_model() # 이미 상단에 정의되어 있지만, 명시적으로 다시 호출
    except LookupError as e:
        return JsonResponse({"error": f"모델 로드 실패: {e}"}, status=500)

    try:
        # User = get_user_model() 선언 덕분에 User.objects.get 사용 가능
        user = User.objects.get(id=user_id) # user_id 필드 대신 id 필드로 검색하는 것이 안전
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

@csrf_exempt
@require_POST
def fetch_article_preview(request):
    """
    URL을 받아 메타데이터(제목, 이미지, 언론사 등)를 추출하여 반환합니다.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON 형식이 아닙니다."}, status=400)

    url = data.get("url")

    if not url:
        return JsonResponse({"error": "url은 필수입니다."}, status=400)

    # 1) 메타데이터 크롤링
    try:
        meta = fetch_article_metadata(url)
    except Exception as e:
        # 크롤링 실패 시 오류 메시지와 함께 빈 객체 반환
        print(f"Metadata fetch failed for {url}: {e}")
        return JsonResponse({"error": f"기사 정보를 가져오는 데 실패했습니다: {e}"}, status=500)

    # 2) 응답: 프론트엔드가 미리보기에 사용할 정보만 반환
    return JsonResponse({
        "title": meta.get("title", "제목 없음"),
        "summary": meta.get("summary", ""),
        "image": meta.get("image", ""),
        "url": url,
        # 언론사 이름은 여기서 크롤링 결과에 포함될 수도 있으나, 
        # 사용자 선택 전에 빈 값으로 두거나 크롤링 결과(meta['media_name'])를 사용할 수 있습니다.
        "media_name_from_meta": meta.get("media_name", "출처 불명"),
    })