from django.db import models
from django.contrib.auth.models import AbstractUser  # BaseUserManager 필요 없음, 지워도 됨

class User(AbstractUser):
    email = models.CharField(max_length=50, unique=True)
    nickname = models.CharField(max_length=15)
    age = models.IntegerField(null=True)
    gender = models.CharField(max_length=2)

    def __str__(self):
        return self.username
    

class Following(models.Model):
    following_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='follow_from')
    user2 = models.ForeignKey('User', on_delete=models.CASCADE, related_name='follow_to')

    class Meta:
        unique_together = ('user', 'user2')