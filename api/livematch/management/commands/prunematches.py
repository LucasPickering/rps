from datetime import timedelta
from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone

from livematch.models import LiveMatch


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
        cutoff_time = timezone.now() - timedelta(seconds=ttl)
        total, per_model = LiveMatch.objects.filter(
            Q(player1=None) | Q(player1__last_activity__lt=cutoff_time),
            Q(player2=None) | Q(player2__last_activity__lt=cutoff_time),
        ).delete()
        print(f"Deleted {total} rows ({per_model})")
