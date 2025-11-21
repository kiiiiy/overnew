#recommend/urls.py

from django.urls import path
from .views import RecommendUserView

urlpatterns = [
    path('api/recommend', RecommendUserView.as_view(), name='api_recommend_user'),
]