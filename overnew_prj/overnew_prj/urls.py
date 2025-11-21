from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("community/", include(("discussion.urls", "discussion"), namespace="discussion")),
    path('account/', include('account.urls')),
    path('feed/', include('feed.urls')),
    path("", include("archive.urls")),
]
