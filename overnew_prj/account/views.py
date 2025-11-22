from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import transaction
import json

from .models import NewsCategory, Media, UserNews, UserMedia
from django.core.mail import send_mail
from django.conf import settings
import random
from django.contrib.auth import get_user_model

User = get_user_model()

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

@csrf_exempt
@require_POST
@transaction.atomic
def api_signup(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식"}, status=400)
    
    if not request.session.get("signup_email_verified"):
        return JsonResponse(
            {"ok": False, "error": "이메일 인증이 완료되지 않았습니다."},
            status=400,
        )

    verified_email = request.session.get("signup_email")

    username = data.get("userId", "").strip()
    password = data.get("password", "").strip()
    nickname = data.get("nickname", "").strip()

    if not username or not password or not nickname:
        return JsonResponse({"ok": False, "error": "아이디/비밀번호/닉네임은 필수입니다."})

    if User.objects.filter(username=username).exists():
        return JsonResponse({"ok": False, "error": "이미 존재하는 아이디입니다."})

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

    user = User.objects.create_user(
        username=username,
        password=password,
        nickname=nickname,
        age=age,
        gender=gender,
        stance=stance,
        email=verified_email,
    )

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
        
    for key in ["signup_email", "signup_verification_code", "signup_email_verified"]:
        request.session.pop(key, None)

    return JsonResponse({"ok": True, "user_id": user.id})

@csrf_exempt
@require_POST
def login_api(request):
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

@login_required
@csrf_exempt
@require_POST
def profile_update_api(request):
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
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식입니다."}, status=400)

    email = (data.get("email") or "").strip()
    if not email:
        return JsonResponse({"ok": False, "error": "이메일을 입력해 주세요."}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse(
            {"ok": False, "error": "이미 사용 중인 이메일입니다."},
            status=400,
        )

    code = random.randint(100000, 999999)
    code_str = str(code)

    request.session["signup_email"] = email
    request.session["signup_verification_code"] = code_str
    request.session["signup_email_verified"] = False

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

    request.session["signup_email_verified"] = True

    return JsonResponse({"ok": True})