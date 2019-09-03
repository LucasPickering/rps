from rest_framework.views import APIView
from rest_framework.response import Response

from core.models import Player
from core.serializers import PlayerSummarySerializer
from livematch.serializers import LiveMatchConfigSerializer


def new_match(request, *args, **kwargs):
    """
    Return a slack message with a link to a new match
    """
    # Could potentially add arguments to allow game configuration here
    serializer = LiveMatchConfigSerializer(data={})
    serializer.is_valid(raise_exception=True)
    live_match = serializer.save()

    return Response(
        {
            "response_type": "in_channel",
            "text": request.build_absolute_uri(
                "/matches/live/{}".format(live_match.id)
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
            "text": {"type": "mrkdwn", "text": "*Leaderboard*"},
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Username*         *Wins*     *Losses*     *Win%*",
            },
        },
        {"type": "divider"},
    ]
    for player_data in PlayerSummarySerializer(
        Player.objects.annotate_match_outcomes().order_by("-match_win_pct"),
        many=True,
    ).data:
        blocks.append(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*{username:<23}* "
                    "{match_win_count:<11} "
                    "{match_loss_count:<15} "
                    "{match_win_pct:.3f}".format(
                        username=player_data.get("username"),
                        match_win_count=player_data.get("match_win_count"),
                        match_loss_count=player_data.get("match_loss_count"),
                        match_win_pct=player_data.get("match_win_pct"),
                    ),
                },
            }
        )
    return Response({"response_type": "in_channel", "blocks": blocks})


def error_response(request, *args, **kwargs):
    """
    Return a slack error message
    """
    return Response(
        {
            "response_type": "in_channel",
            "text": "Sorry, that operation is not supported. Please try again.",
        }
    )


class SlackIntegrationView(APIView):
    """
    Slack integration only hits one API endpoint, but with different payloads.
    Hence implement this view with a bunch of response generators to keep logic organized
    """

    permission_classes = []  # This API view doesn"t need to check CSRF
    RESPONSE_TYPES = {"new": new_match, "leaderboard": leaderboard}

    def post(self, request, *args, **kwargs):
        """
        For now there is only one type of slack integration, which is to generate a new match.

        In the future if we include more workflow like `/rps leaderboard`,
        we can parse the message here and return different type of responses.
        """
        request_type = request.data.get("text")
        return self.RESPONSE_TYPES.get(request_type, error_response)(
            request, *args, **kwargs
        )
