import logging
from datetime import timedelta
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Q, Max
from django.utils import timezone

from livematch.models import LiveMatch


logger = logging.getLogger(settings.RPS_LOGGER_NAME)


class Command(BaseCommand):
    help = "Clean up inactive LiveMatch instances"

    def add_arguments(self, parser):
        parser.add_argument(
            "--ttl",
            type=int,
            default=60 * 60 * 24,  # 24h
            help="How long since a match was active (in seconds) to prune it",
        )
        parser.add_argument(
            "--dry-run", action="store_true", help="Don't actually delete shit"
        )

    def handle(self, *args, ttl, dry_run, **options):
        logger.info("Pruning LiveMatch...")
        cutoff_time = timezone.now() - timedelta(seconds=ttl)
        matches_to_delete = LiveMatch.objects.annotate(
            npa=Max("liveplayermatch__last_activity")
        ).filter(
            Q(npa=None) | Q(npa__lt=cutoff_time),
            start_time__lt=cutoff_time,
            # Completed matches shouldn't be deleted, because they are needed
            # for linking to Matches and other LiveMatches
            permanent_match_id=None,
        )

        if dry_run:
            logger.info(
                f"Skipping deleting {matches_to_delete.count()} matches"
            )
        else:
            total, per_model = matches_to_delete.delete()
            logger.info(f"Deleted {total} rows ({per_model})")
