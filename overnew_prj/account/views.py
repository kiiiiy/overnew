# account/views.py (통합 및 수정 완료)

from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.contrib import messages
import json
import random
import time

from .models import NewsCategory, Media, UserNews, UserMedia # account 앱의 유틸리티 모델
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

# 커스텀 유저 모델 로드
User = get_user_model()

# --- 템플릿 렌더링 뷰 (GET) ---

def splash(request):
    """시작/온보딩 페이지 렌더링 (index.html)"""
    return render(request, "account/index.html")

def info_step1(request):
    """Step 1 (이름, 나이, 성별) 렌더링"""
    # POST 로직은 아래 쪽에 구현
    return render(request, "account/info-step1.html")

def info_step2(request):
    """Step 2 (정치 성향) 렌더링"""
    # POST 로직은 아래 쪽에 구현
    return render(request, "account/info-step2.html")

def info_step3(request):
    """Step 3 (선호 분야) 렌더링 및 POST 처리"""
    if request.method == 'POST':
        # POST: 데이터 저장 후 Step 4로 리다이렉트
        preferred_categories = request.POST.getlist('topic') 
        
        signup_data = request.session.get('signup_data', {})
        signup_data['preferred_categories'] = preferred_categories
        request.session['signup_data'] = signup_data
        
        return redirect('account:info_step4')
        
    # GET: 템플릿 렌더링
    # 템플릿에 NewsCategory 목록을 전달하여 선택지 렌더링에 사용 (선택사항)
    categories = NewsCategory.objects.all() 
    return render(request, "account/info-step3.html", {'categories': categories})

def info_step4(request):
    """Step 4 (선호 언론사) 렌더링 및 POST 처리"""
    if request.method == 'POST':
        # POST: 데이터 저장 후 Step 5로 리다이렉트
        preferred_media = request.POST.getlist('media') 
        
        signup_data = request.session.get('signup_data', {})
        signup_data['preferred_media'] = preferred_media
        request.session['signup_data'] = signup_data
        
        return redirect('account:info_step5')
        
    # GET: 템플릿 렌더링
    # 템플릿에 Media 목록을 전달하여 선택지 렌더링에 사용 (선택사항)
    media_list = Media.objects.all() 
    return render(request, "account/info-step4.html", {'media_list': media_list})

def info_step5(request):
    """Step 5 (최종 계정 정보) 렌더링"""
    return render(request, "account/info-step5.html")

def signup_complete(request):
    """회원가입 완료 페이지 렌더링"""
    return render(request, "account/signup-complete.html")

def notifications_view(request):
    """알림 페이지 렌더링"""
    return render(request, "account/notifications.html")

def profile_edit_view(request):
    """프로필 수정 페이지 렌더링"""
    # 이 뷰는 로그인 사용자에게 현재 정보를 보여주는 로직이 추가될 수 있습니다.
    return render(request, "account/profile-edit.html")

def settings_view(request):
    """설정 페이지 렌더링 (로그인 상태에 따라 다름)"""
    if request.user.is_authenticated:
        return render(request, "account/settings-logged-in.html")
    else:
        return render(request, "account/settings-logged-out.html")


def login_view(request):
    """
    로그인 폼을 렌더링하고, POST 요청이 들어오면 인증을 처리합니다.
    """
    #if request.user.is_authenticated:
        # 이미 로그인된 경우, 피드 페이지로 리다이렉션
        #return redirect('feed') # 'feed'는 피드 뷰의 URL 이름이라고 가정합니다.

    if request.method == 'POST':
        # 1. 폼에서 ID와 비밀번호를 가져옵니다. (HTML input의 name 속성 사용)
        username = request.POST.get('username')
        password = request.POST.get('password')

        # 2. Django의 authenticate 함수를 사용하여 사용자 인증
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # 3. 인증 성공 시, login 함수를 사용하여 세션을 시작합니다.
            login(request, user)
            
            # 4. 로그인 성공 후 피드 페이지(루트 '/' 또는 'feed' URL 이름)로 리다이렉션
            return redirect('feed') 
        else:
            # 5. 인증 실패 시, 에러 메시지를 템플릿으로 전달합니다.
            messages.error(request, '아이디 또는 비밀번호가 올바르지 않습니다.')
            # 다시 로그인 페이지를 렌더링
            return render(request, 'account/login.html')

    # GET 요청 시, 로그인 폼을 렌더링
    return render(request, 'account/login.html')
from django.contrib.auth.decorators import login_required

@login_required(login_url='account:login')
def profile_edit_view(request):
    """프로필 수정 페이지 렌더링"""
    return render(request, "account/profile-edit.html")

@login_required
def logout_view(request):
    """
    로그아웃을 처리하고 로그인 페이지로 리다이렉션합니다.
    """
    logout(request)
    # 로그아웃 후 로그인 페이지로 리다이렉션 (URL 이름: 'account:login')
    return redirect('account:login')

# ------------------------------------------------------------------
# 💡 [추가] 로그인 API 엔드포인트 구현 (JSON 요청 처리)
# ------------------------------------------------------------------
@csrf_exempt
@require_POST
def api_login(request):
    """
    JSON 형식의 POST 요청을 처리하여 로그인 인증 및 세션 설정을 수행합니다.
    """
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식입니다."}, status=400)
    
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()
    
    if not username or not password:
        return JsonResponse({"ok": False, "error": "아이디와 비밀번호를 모두 입력해 주세요."}, status=400)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        # 💡 로그인 성공 시, 필요한 유저 정보만 JSON으로 반환
        return JsonResponse({"ok": True, "message": "로그인 성공", "user": {"username": user.username, "nickname": user.nickname}})
    else:
        return JsonResponse({"ok": False, "error": "아이디 또는 비밀번호가 올바르지 않습니다."}, status=401)


# --- 다단계 회원가입 Step 1/2 세션 처리 (POST) ---

@require_POST
def info_step1_post(request):
    """Step 1 POST 처리 (기본 정보)"""
    # name 필드는 User 모델에 없지만, 프론트에서 인사말에 사용될 수 있으므로 일단 세션에 저장
    user_name = request.POST.get('user-name') 
    age = request.POST.get('user-age') # info-step1.html의 input id
    gender = request.POST.get('gender') # info-step1.html의 input name
    
    # ⚠️ 유효성 검사 (예: 나이, 성별 필수)는 추가해야 합니다.
    
    signup_data = request.session.get('signup_data', {})
    signup_data.update({
        'name': user_name,
        'age': age,
        'gender': gender,
    })
    request.session['signup_data'] = signup_data
    
    return redirect('account:info_step2')

@require_POST
def info_step2_post(request):
    """Step 2 POST 처리 (정치 성향)"""
    stance = request.POST.get('stance') # info-step2.html의 input name
    
    # ⚠️ 유효성 검사 (성향 필수)는 추가해야 합니다.
    
    signup_data = request.session.get('signup_data', {})
    signup_data['stance'] = stance
    request.session['signup_data'] = signup_data
    
    return redirect('account:info_step3')


# --- API 뷰 (이메일 인증, 최종 회원가입) ---

@csrf_exempt
@require_POST
def send_signup_verification_code(request):
    """이메일로 인증 코드를 전송하고 세션에 저장 (API)"""
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식입니다."}, status=400)

    email = (data.get("email") or "").strip()

    # 1. 📧 이메일 형식 및 중복 확인
    if not email:
        return JsonResponse({"ok": False, "error": "이메일이 필요합니다."}, status=400)
        
    if User.objects.filter(email=email).exists():
        return JsonResponse({"ok": False, "error": "이미 사용 중인 이메일입니다."}, status=409)

    # 2. 인증 코드 생성 및 세션 저장
    code_str = "".join([str(random.randint(0, 9)) for _ in range(6)])
    request.session["signup_email"] = email
    request.session["signup_verification_code"] = code_str
    # 🌟 인증번호 만료 시간 설정 (예: 10분)
    request.session["signup_verification_expires"] = int(time.time()) + 60 * 10 

    # 3. 이메일 전송 (기존 로직 유지)
    subject = "[OVERNEW] 회원가입 이메일 인증번호"
    message = f"회원가입을 위한 인증번호는 {code_str} 입니다.\n10분 이내에 입력해 주세요."
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", settings.EMAIL_HOST_USER)

    try:
        # ⚠️ 실제로 이메일 서버가 설정되어 있어야 작동합니다.
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
    """이메일 인증 코드 확인 (API)"""
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "잘못된 JSON 형식입니다."}, status=400)

    email = (data.get("email") or "").strip()
    code = (data.get("code") or "").strip()

    session_email = request.session.get("signup_email")
    session_code = request.session.get("signup_verification_code")
    session_expires = request.session.get("signup_verification_expires", 0)

    if not session_email or not session_code:
        return JsonResponse(
            {"ok": False, "error": "인증번호를 다시 요청해 주세요."},
            status=400,
        )
    
    # 1. 만료 시간 확인
    if int(time.time()) > session_expires:
        return JsonResponse(
            {"ok": False, "error": "인증번호가 만료되었습니다. 다시 요청해 주세요."},
            status=400,
        )

    # 2. 이메일 및 코드 일치 확인
    if email != session_email or code != session_code:
        return JsonResponse(
            {"ok": False, "error": "인증번호가 일치하지 않습니다."},
            status=400,
        )

    # 3. 인증 성공 시 세션에 인증 상태 저장
    request.session["email_verified"] = True
    # ⚠️ 인증 성공 후 코드, 만료 시간 등은 삭제하는 것이 좋습니다.
    # del request.session["signup_verification_code"]
    # del request.session["signup_verification_expires"]

    return JsonResponse({"ok": True, "redirect_url": "/signup/step1/"})


@csrf_exempt
@require_POST
@transaction.atomic # DB 작업을 묶어 처리 (실패 시 롤백)
def api_signup(request):
    """Step 5 데이터와 세션 데이터를 합쳐 최종적으로 User 모델 생성 및 DB 저장 (API)"""
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "Invalid JSON"}, status=400)
    
    # 1. 필수 세션 데이터 확인
    signup_data = request.session.get('signup_data', {})
    email = request.session.get('signup_email')
    is_verified = request.session.get('email_verified', False)

    if not email or not is_verified:
        return JsonResponse({"ok": False, "error": "이메일 인증이 필요합니다."}, status=403)
        
    # 2. Step 5 데이터 추출
    username = data.get('username') 
    password = data.get('password')
    nickname = data.get('nickname')

    # 3. 최종 데이터 유효성 검사 (ID/닉네임 중복, 비밀번호 길이 등)
    if User.objects.filter(username=username).exists():
         return JsonResponse({"ok": False, "error": "이미 사용 중인 ID입니다."}, status=409)
    if User.objects.filter(nickname=nickname).exists():
         return JsonResponse({"ok": False, "error": "이미 사용 중인 닉네임입니다."}, status=409)
         
    # 4. User 모델 생성에 필요한 필드 설정
    user_fields = {
        'username': username,
        'email': email,
        'nickname': nickname,
        'age': signup_data.get('age'),
        'gender': signup_data.get('gender'),
        'stance': signup_data.get('stance'),
    }

    try:
        # 5. User 모델 생성 및 비밀번호 설정 (create_user는 UserManager에 정의됨)
        user = User.objects.create_user(password=password, **user_fields)
    except ValueError as e:
        return JsonResponse({"ok": False, "error": f"User creation failed: {e}"}, status=400)


    # 6. M2M 관계 저장 (UserNews, UserMedia)
    # 카테고리 처리
    category_codes = signup_data.get('preferred_categories', [])
    categories = NewsCategory.objects.filter(code__in=category_codes)
    for category in categories:
        UserNews.objects.create(user=user, category=category)
        
    # 언론사 처리
    media_codes = signup_data.get('preferred_media', [])
    media_list = Media.objects.filter(code__in=media_codes)
    for media_item in media_list:
        UserMedia.objects.create(user=user, media=media_item)

    # 7. 세션 정리 및 성공 응답
    for key in ['signup_data', 'signup_email', 'email_verified', 'signup_verification_code', 'signup_verification_expires']:
        if key in request.session:
            del request.session[key]
    
    return JsonResponse({"ok": True, "redirect_url": "/signup/complete/"})