import logging
from django.conf import settings
from django.core.management.base import BaseCommand
from allauth.socialaccount.models import SocialAccount


logger = logging.getLogger(settings.RPS_LOGGER_NAME)


class Command(BaseCommand):
    help = "Copy social-provided data into the User model"

    def handle(self, *args, **options):
        for soc_acc in SocialAccount.objects.select_related("user"):
            user = soc_acc.user
            if not user.email:
                user.email = soc_acc.extra_data["email"]
                user.save()
                logger.info(f"Updated email for {user.username}")
