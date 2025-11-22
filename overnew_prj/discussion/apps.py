from django.apps import AppConfig


class DiscussionConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "discussion"

    def ready(self):
        # 앱 로딩 시 신호 연결
        from . import signals  # noqa: F401