from django.db.models import Q, F, Count, QuerySet, FloatField, Case, When
from django.db.models.functions import Cast


class PlayerQuerySet(QuerySet):
    def annotate_stats(self):
        return self.annotate(
            match_count=Count("matches", distinct=True),
            match_win_count=Count("match_wins", distinct=True),
            match_loss_count=Count(
                "matches", filter=~Q(matches__winner=F("id")), distinct=True
            ),
            match_win_pct=Case(
                When(match_count=0, then=0),
                # Must cast the denominator to get it to do float division
                default=F("match_win_count")
                / Cast(F("match_count"), FloatField()),
                output_field=FloatField(),
            ),
        )


class MatchQuerySet(QuerySet):
    def annotate_losers(self):
        return self  # TODO
