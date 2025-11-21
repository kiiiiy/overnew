#archive/models.py
from django.db import models
from users.models import *

<<<<<<< HEAD
class MediaCategory(models.Model):
    mc_id = models.AutoField(primary_key=True)
    media_category = models.CharField(max_length=10)

    def __str__(self):
        return self.media_category
    

class Media(models.Model):
    media_id = models.AutoField(primary_key=True)
    media_name = models.CharField(max_length=15)
    mc = models.ForeignKey(MediaCategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.media_name
    

class UserMedia(models.Model):  
=======

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, unique=True)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128) 
    nickname = models.CharField(max_length=15)
    age = models.IntegerField()
    gender = models.CharField(max_length=2)

    def __str__(self):
        return self.nickname or self.username


class NewsCategory(models.Model):
    nc_id = models.AutoField(primary_key=True)
    news_category = models.CharField(max_length=10)  

    def __str__(self):
        return self.news_category


class Media(models.Model):
    media_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class UserNews(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nc = models.ForeignKey(NewsCategory, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'nc')


class UserMedia(models.Model):
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('media', 'user')


<<<<<<< HEAD
class NewsCategory(models.Model):
    nc_id = models.AutoField(primary_key=True)
    news_category = models.CharField(max_length=10)
    

    def __str__(self):
        return self.news_category


class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    news_content = models.TextField(blank=True)
=======
class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    news_content = models.TextField(blank=True) 
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
    image = models.URLField(blank=True)
    nc = models.ForeignKey(
        NewsCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='articles'
    )
    media = models.ForeignKey(
        Media,
        on_delete=models.SET_NULL,
        null=True,
        related_name='articles'
    )
<<<<<<< HEAD
    url = models.URLField(unique=True)
    summary = models.TextField(blank=True)
=======
    url = models.URLField(unique=True) 
    summary = models.TextField(blank=True) 
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Scrap(models.Model):
<<<<<<< HEAD
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
=======
    user = models.ForeignKey(User, on_delete=models.CASCADE)
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
    news = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'news')


class Discussion(models.Model):
    news = models.ForeignKey(Article, on_delete=models.CASCADE)
<<<<<<< HEAD
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
=======
    user = models.ForeignKey(User, on_delete=models.CASCADE)
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('news', 'user')
<<<<<<< HEAD

class UserNews(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(NewsCategory, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'category')  # 중복 선택 방지

    def __str__(self):
        return f"{self.user.username} - {self.category.news_category}"
=======
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
