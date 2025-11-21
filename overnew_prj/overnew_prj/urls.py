#overnew_prj/overnew_prj/urls.py

from django.contrib import admin
from django.urls import path, include
<<<<<<< HEAD



urlpatterns = [
    path("admin/", admin.site.urls),
    path("community/", include(("discussion.urls", "discussion"), namespace="discussion")),
    path('account/', include('account.urls')),
]

=======

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("archive.urls")),
]
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
