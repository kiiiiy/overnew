from django.db.models.signals import post_save
from django.dispatch import receiver
from archive.models import Article
from .models import DiscussionRoom

@receiver(post_save, sender=Article)
def create_discussion_rooms_for_article(sender, instance, created, **kwargs):
    """
    Article 이 처음 생성될 때
    - 실명방 (is_anonymous=False)
    - 익명방 (is_anonymous=True)
    둘 다 자동으로 만들어 준다
    """
    if not created:
        return

    for is_anonymous in (False, True):
        DiscussionRoom.objects.get_or_create(
            article=instance,
            is_anonymous=is_anonymous,
        )