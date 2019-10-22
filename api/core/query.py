from django.db.models import F, Q, Count, QuerySet, FloatField, Case, When
from django.db.models.functions import Cast
from django.contrib.auth.models import Group


class PlayerQuerySet(QuerySet):
    def annotate_stats(self, group_id=None):
        # If a group was specified, build a filter to get all matches that
        # include ONLY players from the group
        if group_id is not None:
            # All matches where both the winner and the loser are in the group
            group_filter = Q(
                matches__winner__groups=group_id,
                matches__loser__groups=group_id,
            )
        else:
            group_filter = Q()

        return self.annotate(
            match_win_count=Count(
                "matches",
                filter=group_filter & Q(matches__winner=F("id")),
                distinct=True,
            ),
            match_loss_count=Count(
                "matches",
                filter=group_filter & Q(matches__loser=F("id")),
                distinct=True,
            ),
            match_count=F("match_win_count") + F("match_loss_count"),
            match_win_pct=Case(
                When(match_count=0, then=0),
                # Must cast the denominator to get it to do float division
                default=F("match_win_count")
                / Cast(F("match_count"), FloatField()),
                output_field=FloatField(),
            ),
        )

    def filter_and_annotate_for_group(self, group_name):
        """
        Filters this query set to only show players in the group with the given
        name. Also calls annotate_stats for that group, so that stats are
        annotated for all matches within the group

        Arguments:
            group_name {string} -- The name of the group to filter by

        Returns:
            QuerySet -- The filtered/annotated query set
        """
        group_id = Group.objects.values_list("id", flat=True).get(
            name=group_name
        )
        return self.filter(groups__id=group_id).annotate_stats(
            group_id=group_id
        )
