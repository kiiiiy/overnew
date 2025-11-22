# account/admin.py
from django.contrib import admin
from .models import NewsCategory, Media 
# from .models import User, UserNews, UserMedia 는 임포트 불필요

@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name')
    search_fields = ('code', 'name')
    ordering = ('id',)

@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name')
    search_fields = ('code', 'name')
    ordering = ('id',)

# User, UserNews, UserMedia 등록 코드는 모두 users/admin.py로 이동했습니다.