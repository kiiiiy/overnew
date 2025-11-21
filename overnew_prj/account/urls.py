from django.urls import path
from .views import *
app_name='account'

urlpatterns=[
    path('mypage/', mypage, name="mypage"),
    path('update/', update, name="update")
]