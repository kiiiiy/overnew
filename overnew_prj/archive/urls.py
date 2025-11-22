#archive/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # API 엔드포인트
    path('api/article/preview', views.fetch_article_preview, name='api_article_preview'),
    path("articles/upload/", views.upload_article, name="upload_article"),
    path("api/users/<int:user_id>/scraps/", views.scrap_list, name="scrap_list"),
    path("api/articles/<int:article_id>/", views.get_article_detail_api, name="api_article_detail"), 
    path("api/follow/toggle/", views.follow_toggle, name="api_follow_toggle"),
    path("api/users/<int:user_id>/following/", views.get_following_list, name="api_get_following_list"), # 🌟 추가
    
    # HTML
    path("archive/", views.archive_main, name="archive_main"),
    path("article/", views.article_detail, name="article_detail"),
    path("scrap/create/", views.create_scrap, name="create_scrap"),
    path("profile/", views.profile_detail, name="profile_detail"),
    

    # 기타
    path("ping/", views.ping, name="ping"),
]