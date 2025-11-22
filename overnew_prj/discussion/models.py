from django.db import models
from archive.models import *
from django.utils import timezone
from users.models import *
from datetime import timedelta

# Create your models here.

def default_finish_time():
    return timezone.now() + timedelta(days=7)

class DiscussionRoom(models.Model):
    room_id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField(default=timezone.now)
    finish_time = models.DateTimeField(default=default_finish_time)

    # 🔥 OneToOne → ForeignKey 로 변경
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='discussion_rooms'
    )

    is_anonymous = models.BooleanField(default=False)
    bookmark = models.ManyToManyField(User, related_name="bookmark_room")

    def __str__(self):
        return f"[{'익명' if self.is_anonymous else '실명'}] {self.article.title}"

    class Meta:
        # 한 기사당 (실명, 익명) 각 1개씩만 허용
        constraints = [
            models.UniqueConstraint(
                fields=['article', 'is_anonymous'],
                name='unique_article_room_per_type',
            )
        ]
    

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    comment_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(DiscussionRoom, on_delete=models.CASCADE)

    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies'
    )

    def __str__(self):
        return f"Comment {self.comment_id}"