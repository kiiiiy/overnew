#archive/models.py
from django.db import models


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
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('media', 'user')


class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    news_content = models.TextField(blank=True) 
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
    url = models.URLField(unique=True) 
    summary = models.TextField(blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Scrap(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    news = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'news')


class Discussion(models.Model):
    news = models.ForeignKey(Article, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('news', 'user')
