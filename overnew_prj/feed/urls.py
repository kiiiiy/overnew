from django.urls import path
from .views import *

app_name="feed"

urlpatterns=[
    path('hot/', hot_feed, name='hot_feed'),
    path('', feed, name='feed'),
    path('following/', following_feed, name="following_feed"),
]