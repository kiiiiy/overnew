from django.db import models
from django.contrib.auth.models import AbstractUser  
import os
from uuid import uuid4
from django.utils import timezone

def  upload_filepath(instance, filename):
    today_str=timezone.now().strftime("%Y%m%d")
    file_basename=os.path.basename(filename)
    return f'{instance._meta.model_name}/{today_str}/{str(uuid4())}_{file_basename}'


class User(AbstractUser):
    email = models.CharField(max_length=50, unique=True)
    nickname = models.CharField(max_length=15)
    age = models.IntegerField(null=True)
    gender = models.CharField(max_length=2)
    profile_image=models.ImageField(upload_to=upload_filepath, blank=True)

    def __str__(self):
        return self.username
    

class Following(models.Model):
    following_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='follow_from')
    user2 = models.ForeignKey('User', on_delete=models.CASCADE, related_name='follow_to')

    class Meta:
        unique_together = ('user', 'user2')