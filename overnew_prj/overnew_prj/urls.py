#overnew_prj/overnew_prj/urls.py

from django.contrib import admin
from django.urls import path, include
<<<<<<< HEAD



urlpatterns = [
    path("admin/", admin.site.urls),
    path("community/", include(("discussion.urls", "discussion"), namespace="discussion")),
    path('account/', include('account.urls')),
    path('feed/', include('feed.urls')),
]

=======

urlpatterns = [
    path("admin/", admin.site.urls),
    path("account/", include("account.urls")),
    path("", include("archive.urls")),
]
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
