# overnew_prj/account/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random
import string


class User(AbstractUser):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=50, unique=True)
    nickname = models.CharField(max_length=15)
    age = models.PositiveIntegerField(null=True, blank=True)
    GENDER_CHOICES = (
        ('M', '남'),
        ('F', '여'),
    )
    gender = models.CharField(max_length=2, choices=GENDER_CHOICES, blank=True)

    is_email_verified = models.BooleanField(default=False)

    REQUIRED_FIELDS = ['email']  

    def __str__(self):
        return self.username


class VerificationCode(models.Model):
    TYPE_CHOICES = (
        ('email', 'Email'),
        ('phone', 'Phone'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} - {self.type} - {self.code}'

    @staticmethod
    def generate_code(length=6):
        return ''.join(random.choices(string.digits, k=length))

    @classmethod
    def create_code(cls, user, type='email', minutes_valid=5):
        now = timezone.now()
        code = cls.generate_code()
        return cls.objects.create(
            user=user,
            code=code,
            type=type,
            expires_at=now + timedelta(minutes=minutes_valid),
        )
