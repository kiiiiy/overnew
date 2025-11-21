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