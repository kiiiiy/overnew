#overnew_prj/overnew_prj/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("account/", include("account.urls")),
    path("", include("archive.urls")),
    path('recommend/', include('recommend.urls')),
]