from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Article)
admin.site.register(Media)
admin.site.register(MediaCategory)
admin.site.register(NewsCategory)
admin.site.register(UserMedia)
admin.site.register(UserNews)
admin.site.register(Like)