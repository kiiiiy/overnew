# recommend/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    path('api/recommend/', RecommendUserView.as_view(), name='api_recommend_list'),
    path('main/', recommend_main, name='recommend_main'),
]

