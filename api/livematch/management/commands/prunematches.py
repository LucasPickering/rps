from datetime import timedelta
from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone
from enum import Enum

from livematch.models import LiveMatch


class OrphanType(Enum):
    COMPLETE = "complete"

    @classmethod
    def all(cls):
        return tuple(e.value for e in cls)


class Command(BaseCommand):
    help = "Clean up orphaned LiveMatch instances"

    def add_arguments(self, parser):
        parser.add_argument(
            "--types",
            nargs="*",
            choices=OrphanType.all(),
            default=OrphanType.all(),
            help="The types of orphans to clean up",
        )
        parser.add_argument(
            "--ttl",
            type=int,
            default=60 * 60 * 24,  # 24h
            help="How long since a match started (in seconds) to prune it",
        )

    def handle(self, *args, types, ttl, **options):
        cutoff_time = timezone.now() - timedelta(seconds=ttl)
        q = Q(start_time__lt=cutoff_time)
        if OrphanType.COMPLETE.value in types:
            # permanent_match is populated if match is complete
            q |= Q(permanent_match__isnull=False)
        LiveMatch.objects.filter(q).delete()
