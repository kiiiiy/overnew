#archive/urls.py
from django.urls import path
from . import views

urlpatterns = [
    #HTML
    path("", views.index, name="archive_index"),

    #API 엔드포인트
    path("ping/", views.ping, name="ping"),
    path("articles/upload/", views.upload_article, name="upload_article"),
    path("users/<int:user_id>/scraps/", views.scrap_list, name="scrap_list"),
]