<<<<<<< HEAD
from django.shortcuts import render, redirect
from users.models import *
from archive.models import *
from django.contrib.auth.decorators import login_required

# Create your views here.

def mypage(request):
    all_categories = NewsCategory.objects.all()

    selected_categories = NewsCategory.objects.filter(
        usernews__user=request.user
    )

    return render(request, 'account/mypage.html', {
        'all_categories': all_categories,
        'selected_categories': selected_categories,
    })

@login_required
def update(request):
    user = request.user

    if request.method == "POST":
        # --- 기본 정보 ---
        user.nickname = request.POST.get('nickname')
        user.gender = request.POST.get('gender')
        user.age = request.POST.get('age')

        profile_image = request.FILES.get('profile_image')
        if profile_image:
            if user.profile_image:
                user.profile_image.delete()
            user.profile_image = profile_image

        user.save()

        # --- 좋아하는 방송사 업데이트 ---
        media_ids = request.POST.getlist('media')  # 체크박스 여러개
        UserMedia.objects.filter(user=user).delete()
        for m_id in media_ids:
            UserMedia.objects.create(user=user, media_id=m_id)

        # --- 좋아하는 뉴스 카테고리 업데이트 ---
        nc_ids = request.POST.getlist('news_category')
        UserNews.objects.filter(user=user).delete()
        for nc_id in nc_ids:
            # FK 필드 이름이 category 이니까 category_id 사용
            UserNews.objects.create(user=user, category_id=nc_id)

        return redirect('account:update')  # PRG 패턴

    # ---------- GET 요청일 때 ----------

    # 전체 목록
    medias = Media.objects.all()
    news_categories = NewsCategory.objects.all()

    # 유저가 이미 선택한 것들 id 리스트
    selected_medias = UserMedia.objects.filter(user=user).values_list('media_id', flat=True)
    selected_news = UserNews.objects.filter(user=user).values_list('category_id', flat=True)

    return render(request, 'account/update.html', {
        'user': user,
        'medias': medias,
        'selected_medias': selected_medias,
        'news_categories': news_categories,
        'selected_news': selected_news,
    })
=======
# account/views.py

from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import transaction
import json

from .models import User, NewsCategory, Media, UserNews, UserMedia
from django.core.mail import send_mail
from django.conf import settings
import random



# ================================
# 1. 화면 렌더링 (HTML)
# ================================

def splash(request):
    return render(request, "account/index.html")


def info_step1(request):
    return render(request, "account/info-step1.html")


def info_step2(request):
    return render(request, "account/info-step2.html")


def info_step3(request):
    return render(request, "account/info-step3.html")


def info_step4(request):
    return render(request, "account/info-step4.html")


def info_step5(request):
    return render(request, "account/info-step5.html")


def signup_complete(request):
    return render(request, "account/signup-complete.html")


def login_view(request):
    return render(request, "account/login.html")


def notifications_view(request):
    return render(request, "account/notifications.html")


def profile_edit_view(request):
    return render(request, "account/profile-edit.html")


def settings_view(request):
    if request.user.is_authenticated:
        return render(request, "account/settings-logged-in.html")
    else:
        return render(request, "account/settings-logged-out.html")


# ================================
# 2. 회원가입 API (localStorage → DB 저장)
# ================================

@csrf_exempt
@require_POST
@transaction.atomic
def api_signup(request):
    """
    account.js의 마지막 단계(info-step5)에서
    localStorage의 모든 값을 JSON으로 보내면 그걸 DB에 저장하는 API.

    예시 JSON (account.js에서 전달):
    {
        "name": "홍길동",
        "age": "22",
        "gender": "female",
        "stance": "progressive",
        "topics": ["politics", "economy"],
        "media": ["kh", "hani"],
        "nickname": "길동",
        "userId": "gildong12",
        "password": "1234"
    }
    """

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식"}, status=400)
    
    # 0. 이메일 본인인증 여부 확인
    if not request.session.get("signup_email_verified"):
        return JsonResponse(
            {"ok": False, "error": "이메일 인증이 완료되지 않았습니다."},
            status=400,
        )

    verified_email = request.session.get("signup_email")

    # ------- 필수값 검증 -------
    username = data.get("userId", "").strip()
    password = data.get("password", "").strip()
    nickname = data.get("nickname", "").strip()

    if not username or not password or not nickname:
        return JsonResponse({"ok": False, "error": "아이디/비밀번호/닉네임은 필수입니다."})

    if User.objects.filter(username=username).exists():
        return JsonResponse({"ok": False, "error": "이미 존재하는 아이디입니다."})

    # ------- 기본 정보 -------
    age = int(data.get("age", 0))
    stance = data.get("stance", "unsure")
    gender_raw = data.get("gender", "female")

    gender_map = {
        "female": "F",
        "male": "M",
        "other": "U",
        "unsure": "U"
    }
    gender = gender_map.get(gender_raw, "U")

    # ------- User 생성 -------
    user = User.objects.create_user(
        username=username,
        password=password,
        nickname=nickname,
        age=age,
        gender=gender,
        stance=stance,
        email=verified_email,
    )

    # ------- 분야 저장 (topics) -------
    topics = data.get("topics", [])
    for code in topics:
        category, _ = NewsCategory.objects.get_or_create(
            code=code,
            defaults={"name": code},
        )
        UserNews.objects.get_or_create(
            user=user,
            category=category
        )

    # ------- 언론사 저장 (media) -------
    media_list = data.get("media", [])
    for code in media_list:
        media, _ = Media.objects.get_or_create(
            code=code,
            defaults={"name": code},
        )
        UserMedia.objects.get_or_create(
            user=user,
            media=media
        )
        
    # ------- 세션 정리 -------
    for key in ["signup_email", "signup_verification_code", "signup_email_verified"]:
        request.session.pop(key, None)

    return JsonResponse({"ok": True, "user_id": user.id})

# ================================
# 3. 로그인 / 로그아웃
# ================================

@csrf_exempt
@require_POST
def login_api(request):
    """
    JS에서 fetch()로 로그인할 수 있게 API 버전도 제공 (필요 시).
    """
    data = json.loads(request.body.decode("utf-8"))

    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"ok": False, "error": "ID 또는 비밀번호가 올바르지 않습니다."})

    login(request, user)
    return JsonResponse({"ok": True})


def logout_view(request):
    logout(request)
    return redirect("/account/login/")


# ================================
# 4. 프로필 수정 (기본 형태)
# ================================

@login_required
@csrf_exempt
@require_POST
def profile_update_api(request):
    """
    profile-edit.html에서 보내는 값 처리용 (추후 확장).
    """
    data = json.loads(request.body.decode("utf-8"))
    user = request.user

    nickname = data.get("nickname")
    if nickname:
        user.nickname = nickname

    user.save()
    return JsonResponse({"ok": True})

@csrf_exempt
@require_POST
def send_signup_verification_code(request):
    """
    회원가입 전에 이메일로 인증코드를 보내는 API.

    요청(JSON 예시):
    {
      "email": "test@example.com"
    }
    응답:
      { "ok": true } 또는 { "ok": false, "error": "..." }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식입니다."}, status=400)

    email = (data.get("email") or "").strip()
    if not email:
        return JsonResponse({"ok": False, "error": "이메일을 입력해 주세요."}, status=400)

    # 이미 가입된 이메일인지 체크 (원하면 제거 가능)
    if User.objects.filter(email=email).exists():
        return JsonResponse(
            {"ok": False, "error": "이미 사용 중인 이메일입니다."},
            status=400,
        )

    # 6자리 인증코드 생성
    code = random.randint(100000, 999999)
    code_str = str(code)

    # 세션에 이메일 + 코드 저장
    request.session["signup_email"] = email
    request.session["signup_verification_code"] = code_str
    request.session["signup_email_verified"] = False

    # 메일 발송
    subject = "[OVERNEW] 회원가입 이메일 인증번호"
    message = f"회원가입을 위한 인증번호는 {code_str} 입니다.\n10분 이내에 입력해 주세요."
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", settings.EMAIL_HOST_USER)

    try:
        send_mail(subject, message, from_email, [email], fail_silently=False)
    except Exception as e:
        return JsonResponse(
            {"ok": False, "error": f"이메일 전송 중 오류가 발생했습니다: {e}"},
            status=500,
        )

    return JsonResponse({"ok": True})


@csrf_exempt
@require_POST
def verify_signup_verification_code(request):
    """
    이메일 + 인증코드 입력 받아서 본인인증 성공 여부 확인.

    요청(JSON 예시):
    {
      "email": "test@example.com",
      "code": "123456"
    }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식입니다."}, status=400)

    email = (data.get("email") or "").strip()
    code = (data.get("code") or "").strip()

    session_email = request.session.get("signup_email")
    session_code = request.session.get("signup_verification_code")

    if not session_email or not session_code:
        return JsonResponse(
            {"ok": False, "error": "인증번호를 다시 요청해 주세요."},
            status=400,
        )

    if email != session_email:
        return JsonResponse(
            {"ok": False, "error": "요청한 이메일 주소와 다릅니다."},
            status=400,
        )

    if code != session_code:
        return JsonResponse(
            {"ok": False, "error": "인증번호가 올바르지 않습니다."},
            status=400,
        )

    # 여기까지 왔으면 인증 성공
    request.session["signup_email_verified"] = True

    return JsonResponse({"ok": True})

    

>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
