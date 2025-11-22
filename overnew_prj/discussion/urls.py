from django.urls import path

from .views import *

app_name="discussion"

from django.urls import path
from .views import *

app_name = "discussion"

urlpatterns = [
    path('main/', main, name='main'),
    path('duscussion_list/', discussion_list, name='discussion_list'),
    #path('anonymous/list/<int:nc_id>/', anonymous_list, name='anonymous_list'),
    path('room/<int:room_id>/', discussion_detail, name='discussion_detail'),
    path('anonymous/room/<int:room_id>/', anonymous_detail, name='anonymous_detail'),
    path('room/<int:room_id>/comment/create/', create_comment, name='create_comment'),
    path('room/<int:room_id>/comment/<int:comment_id>/delete/', delete_comment, name='delete_comment'),
    path('api/rooms/', api_room_list, name='api_room_list'),
    path('room/<int:room_id>/bookmark/', toggle_bookmark, name='toggle_bookmark'),
    path("article/<int:article_id>/enter/", choose_mode, name="choose_mode"),
    path('comment/<int:comment_id>/like/', toggle_comment_like, name='toggle_comment_like'),

]

