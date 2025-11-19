from django.db import models
from archive.models import *

# Create your models here.

class DiscussionRoom(models.Model):
    room_id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField()
    finish_time = models.DateTimeField(null=True, blank=True)
    article = models.OneToOneField(Article, on_delete=models.CASCADE)

    def __str__(self):
        return f"Room for {self.article.title}"

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