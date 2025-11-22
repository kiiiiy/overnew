#overnew_prj/overnew_prj/urls.py

from django.contrib import admin
from django.urls import path, include

def root_redirect(request):
    # 사용자가 루트로 접속하면 이 경로로 보내 최초 진입 화면을 보여줍니다.
    return redirect('account:splash')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("account/", include("account.urls")),
    path("archive/", include("archive.urls")),
    path('recommend/', include('recommend.urls')),
]