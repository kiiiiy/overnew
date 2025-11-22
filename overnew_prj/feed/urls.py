from django.urls import path
from .views import *

app_name="feed"

urlpatterns = [
    path('', feed, name='feed'),  # 기존 피드 페이지 (HTML 렌더)
    path('api/hot/', hot_feed_api, name='hot_feed_api'),
    path('api/following/', following_feed_api, name='following_feed_api'),
]