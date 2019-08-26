import logging
from datetime import timedelta
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone

from livematch.models import LiveMatch


logger = logging.getLogger(settings.RPS_LOGGER_NAME)


class Command(BaseCommand):
    help = "Clean up inactive LiveMatch instances"

    def add_arguments(self, parser):
        parser.add_argument(
            "--ttl",
            type=int,
            default=60 * 60 * 6,  # 6h
            help="How long since a match was active (in seconds) to prune it",
        )

    def handle(self, *args, ttl, **options):
        logger.info("Pruning LiveMatch...")
        cutoff_time = timezone.now() - timedelta(seconds=ttl)
        total, per_model = LiveMatch.objects.filter(
            Q(player1=None) | Q(player1__last_activity__lt=cutoff_time),
            Q(player2=None) | Q(player2__last_activity__lt=cutoff_time),
        ).delete()
        logger.info(f"Deleted {total} rows ({per_model})")
