import logging
from datetime import timedelta
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone
from itertools import chain

from livematch.models import LiveMatch, LivePlayerMatch


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

    def handle(self, *args, ttl, **options):
        logger.info("Pruning LiveMatch...")
        cutoff_time = timezone.now() - timedelta(seconds=ttl)
        matches_to_delete = LiveMatch.objects.filter(
            Q(player1=None) | Q(player1__last_activity__lt=cutoff_time),
            Q(player2=None) | Q(player2__last_activity__lt=cutoff_time),
            start_time__lt=cutoff_time,
        )
        # LivePlayerMatch is a target of an FK on LiveMatch, so they don't
        # cascade automatically - we have to gather and delete them manually
        pm_ids_to_delete = set(
            chain(*matches_to_delete.values_list("player1_id", "player2_id"))
        )
        total, per_model = matches_to_delete.delete()
        pm_total, pm_per_model = LivePlayerMatch.objects.filter(
            id__in=pm_ids_to_delete
        ).delete()
        total += pm_total
        per_model.update(pm_per_model)
        logger.info(f"Deleted {total} rows ({per_model})")
