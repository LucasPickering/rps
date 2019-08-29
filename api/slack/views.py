from rest_framework.views import APIView
from rest_framework.response import Response

from core.models import Player
from core.serializers.players import PlayerSummarySerializer
from core.util import get_livematch_id


def new_game(request, *args, **kwargs):
    """
    Return a slack message with a link to a new match
    """
    return Response(
        {
            "response_type": "ephemeral",
            "text": request.build_absolute_uri(
                "/matches/live/{}".format(get_livematch_id())
            ),
            "attachments": [{"text": "Let the battle begin!"}],
        }
    )


def leaderboard(request, *args, **kwargs):
    """
    Return a slack message with a formatted table containing leaderboard data
    Slack doesn't support table layout, but it dose support an aweful lot of layouts.
    There is a chance that this can be better formatted, but as the first release,
    using .ljust() to make sure each section of strings have the same length.
    """
    blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Leaderboard*"
            }
        },
        {
            "type": "divider"
        }
    ]
    for player_data in PlayerSummarySerializer(
            Player.objects.annotate_match_outcomes(),
            many=True
    ).data:
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*{username}*\t"
                        "Wins: {match_win_count}\t"
                        "Losses: {match_loss_count}\t"
                        "Win%: {match_win_pct}%".format(
                            username=player_data.get("username").ljust(10, ' '),
                            match_win_count=str(player_data.get("match_win_count")).ljust(5, ' '),
                            match_loss_count=str(player_data.get("match_loss_count")).ljust(5, ' '),
                            match_win_pct=str(player_data.get("match_win_pct")).ljust(4, ' ')
                        )
            }
        })
    return Response(
        {
            "response_type": "ephemeral",
            "blocks": blocks
        }
    )


def error_response(request, *args, **kwargs):
    """
    Return a slack error message
    """
    return Response(
        {
            "response_type": "ephemeral",
            "text": "Sorry, that operation is not supported. Please try again."
        }
    )


class SlackIntegrationView(APIView):
    """
    Slack integration only hits one API endpoint, but with different payloads.
    Hence implement this view with a bunch of response generators to keep logic organized
    """
    permission_classes = []  # This API view doesn"t need to check CSRF
    RESPONSE_TYPES = {
        None: new_game,
        "leaderboard": leaderboard,
    }

    def post(self, request, *args, **kwargs):
        """
        For now there is only one type of slack integration, which is to generate a new match.

        In the future if we include more workflow like `/rps leaderboard`,
        we can parse the message here and return different type of responses.
        """
        request_type = request.data.get("text")
        return self.RESPONSE_TYPES.get(request_type, error_response)(request, *args, **kwargs)
