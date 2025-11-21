# recommend/urls.py

from django.urls import path
from .views import RecommendUserView

urlpatterns = [
    path('api/list/', RecommendUserView.as_view(), name='api_recommend_list'),
]