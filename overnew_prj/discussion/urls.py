from django.urls import path
from . import views

app_name = 'discussion'

urlpatterns = [
    path('', views.community, name='community'),
    path('community/', views.community, name='community'),
    path('anonymous/', views.discussion_anonymous, name='anonymous'),
    path('realname/', views.discussion_realname, name='realname'),
    path('article/<int:id>/', views.discussion_article_detail, name='article_detail'),
]
