# app_name/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# -----------------
# 1. User 관련 모델
# -----------------
class User(AbstractUser):
    # AbstractUser에 username, email, password 등이 이미 포함되어 있습니다.
    # ERD에 따른 추가 필드 정의
    nickname = models.CharField(max_length=20, unique=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=2, null=True, blank=True)
    # is_staff, is_active 등은 AbstractUser에 있음

    def __str__(self):
        return self.username

# -----------------
# 2. 뉴스 카테고리/기사 관련 모델
# -----------------
class NewsCategory(models.Model):
    nc_id = models.AutoField(primary_key=True)
    news_category = models.CharField(max_length=10, unique=True) # 예: '정치', '경제'

    def __str__(self):
        return self.news_category

class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    url = models.URLField()
    new_url = models.URLField(null=True, blank=True)
    nc = models.ForeignKey(NewsCategory, on_delete=models.CASCADE, db_column='nc_id')

    def __str__(self):
        return self.title

# -----------------
# 3. 사용자 관계 및 관심사 모델
# -----------------
class UserNews(models.Model):
    """ 사용자가 선택한 관심사 키워드 (User - NewsCategory) """
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    nc = models.ForeignKey(NewsCategory, on_delete=models.CASCADE, db_column='nc_id')

    class Meta:
        unique_together = (('user', 'nc'),) # 한 유저가 같은 카테고리를 중복 선택 불가
        db_table = 'UserNews'

class Following(models.Model):
    """ 팔로우 관계 (user_id가 user_id2를 팔로우) """
    user = models.ForeignKey(User, related_name='following_set', on_delete=models.CASCADE, db_column='user_id')
    user2 = models.ForeignKey(User, related_name='follower_set', on_delete=models.CASCADE, db_column='user_id2')

    class Meta:
        unique_together = (('user', 'user2'),)
        db_table = 'Following'

# -----------------
# 4. 댓글/스크랩/토론 관련 모델 (추천 로직에 활용)
# -----------------
class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    comment_content = models.TextField()
    create_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, db_column='news_id', null=True) # 기사에 대한 댓글

    class Meta:
        db_table = 'Comment'

class Scrap(models.Model):
    """ 기사 스크랩 """
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, db_column='news_id')

    class Meta:
        unique_together = (('user', 'article'),)
        db_table = 'Scrap'

# DiscussionRoom, MediaCategory, UserMedia 등 다른 모델은 생략