# recommend/models.py (최종 수정본 - related_name 적용 및 중복 모델 제거)

from django.db import models
from django.utils import timezone
from django.conf import settings
import os
from uuid import uuid4

# -----------------------------------------------------
# ⚠️ 중복 모델 (User, NewsCategory, Media) 정의는 모두 제거되었습니다.
# -----------------------------------------------------

def upload_filepath(instance, filename):
    today_str=timezone.now().strftime("%Y%m%d")
    file_basename=os.path.basename(filename)
    return f'{instance._meta.model_name}/{today_str}/{str(uuid4())}_{file_basename}'


# -----------------
# 1. 기사 관련 모델
# -----------------
class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    url = models.URLField()
    new_url = models.URLField(null=True, blank=True)
    
    # 'account.NewsCategory'를 참조
    nc = models.ForeignKey(
        'account.NewsCategory', 
        on_delete=models.CASCADE, 
        db_column='nc_id'
    )

    def __str__(self):
        return self.title

# -----------------
# 2. 사용자 관계 및 관심사 모델
# -----------------
class UserNews(models.Model):
    """ 사용자가 선택한 관심사 키워드 (User - NewsCategory) """
    user = models.ForeignKey(
        'users.User', 
        on_delete=models.CASCADE, 
        db_column='user_id',
        related_name='rec_usernews_set' 
    )
    # 'account.NewsCategory' 참조 및 related_name 추가
    nc = models.ForeignKey(
        'account.NewsCategory', 
        on_delete=models.CASCADE, 
        db_column='nc_id',
        related_name='rec_category_set'
    )

    class Meta:
        unique_together = (('user', 'nc'),)
        db_table = 'UserNews'

class Following(models.Model):
    """ 팔로우 관계 (user_id가 user_id2를 팔로우) """
    user = models.ForeignKey(
        'users.User', 
        related_name='following_set', 
        on_delete=models.CASCADE, 
        db_column='user_id'
    )
    user2 = models.ForeignKey(
        'users.User', 
        related_name='follower_set', 
        on_delete=models.CASCADE, 
        db_column='user_id2'
    )

    class Meta:
        unique_together = (('user', 'user2'),)
        db_table = 'Following'
