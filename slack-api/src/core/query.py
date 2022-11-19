from __future__ import annotations

from typing import Any, Dict, TYPE_CHECKING
from django.db.models import F, Q, Count, QuerySet, FloatField, Case, When
from django.db.models.functions import Cast


if TYPE_CHECKING:
    from core.models import Player


class PlayerQuerySet(QuerySet):
    def annotate_stats(self, group_id=None) -> PlayerQuerySet:
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

    def get_player(self, body_user: Dict[str, Any]) -> Player:
        """
        Get a player via the the `user` section of an action body. This is a
        convenience method for accessing a player that's sent some Slack
        interaction. If the player isn't in the database yet, we'll insert it
        before returning them.
        """
        (player, created) = self.get_or_create(
            id=body_user["id"], defaults={"name": body_user["name"]}
        )
        return player
