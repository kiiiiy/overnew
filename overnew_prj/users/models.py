from django.db import models
import os
from uuid import uuid4
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, UserManager
)

def  upload_filepath(instance, filename):
    today_str=timezone.now().strftime("%Y%m%d")
    file_basename=os.path.basename(filename)
    return f'{instance._meta.model_name}/{today_str}/{str(uuid4())}_{file_basename}'

class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True, db_column="user_id")

    email = models.EmailField(max_length=50, unique=True)
    nickname = models.CharField(max_length=15, unique=True)
    age = models.IntegerField(null=True)
    gender = models.CharField(max_length=2)
    profile_image=models.ImageField(upload_to=upload_filepath, blank=True)
    username = models.CharField(max_length=20, unique=True)


    GENDER_CHOICES = [
        ("F", "여성"),
        ("M", "남성"),
        ("U", "기타/모름"),
    ]
    gender = models.CharField("성별", max_length=2, choices=GENDER_CHOICES, default="F")

    STANCE_CHOICES = [
        ("progressive", "진보"),
        ("moderate", "중도"),
        ("conservative", "보수"),
        ("unsure", "모름"),
    ]
    stance = models.CharField(
        "정치 성향", max_length=20, choices=STANCE_CHOICES, default="unsure"
    )

    preferred_categories = models.ManyToManyField(
        'account.NewsCategory', 
        through='account.UserNews',  # 이미 정의된 중개 모델을 사용
        through_fields=('user', 'category'),
        related_name='users_by_category'
    )
    
    # 🌟 [추가된 필드 2] 사용자가 선택한 언론사 (info-step4.html 반영)
    # Media 모델과 다대다 관계를 맺으며, 중개 테이블로 UserMedia를 사용합니다.
    preferred_media = models.ManyToManyField(
        'account.Media', 
        through='account.UserMedia', # 이미 정의된 중개 모델을 사용
        through_fields=('user', 'media'),
        related_name='users_by_media'
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS: list[str] = ['email','nickname']

    objects = UserManager()

    class Meta:
        db_table = "user"

    def __str__(self):
        return self.username

    

class Following(models.Model):
    following_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='follow_from')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='follow_to')

    class Meta:
        unique_together = ('user', 'user2')