#archive/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/article/preview', views.fetch_article_preview, name='api_article_preview'),
    #HTML
    path("", views.archive_main, name="archive_main"),
    path("article/", views.article_detail, name="article_detail"),
    path("scrap/create/", views.create_scrap, name="create_scrap"),
    path("profile/", views.profile_detail, name="profile_detail"),

    #API 엔드포인트
    path("ping/", views.ping, name="ping"),
    path("articles/upload/", views.upload_article, name="upload_article"),
    path("users/<int:user_id>/scraps/", views.scrap_list, name="scrap_list"),
]