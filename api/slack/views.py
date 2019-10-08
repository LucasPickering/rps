import random
import re
from texttable import Texttable
from rest_framework.views import APIView
from rest_framework.response import Response

from core.models import Player
from core.serializers import PlayerSummarySerializer
from livematch.serializers import LiveMatchSerializer
from .parser import SlackArgumentParser, ArgumentParserError


NEW_MATCH_MESSAGES = [
    "Let the battle begin",
    "Fight me cowards",
    "It's time to d-d-d-d-d-duel!",
    "oi m8, u 'avin a giggle?",
]


def new_match(request, cmd_args):
    """
    Return a slack message with a link to a new match
    """

    # Could potentially add arguments to allow game configuration here
    serializer = LiveMatchSerializer(data={"config": cmd_args})
    if serializer.is_valid():
        live_match = serializer.save()

        return {
            "response_type": "in_channel",
            "text": request.build_absolute_uri(
                "/matches/live/{}".format(live_match.id)
            ),
            "attachments": [{"text": random.choice(NEW_MATCH_MESSAGES)}],
        }
    else:
        error_str = "\n".join(
            f"  {field}: {', '.join(errors)}"
            for field, errors in serializer.errors["config"].items()
        )
        return {"response_type": "in_channel", "text": f"Error:\n{error_str}"}


def leaderboard(request, cmd_args):
    """
    Return a slack message with a formatted table containing leaderboard data
    Slack doesn't support table layout, but it dose support an aweful lot of
    layouts. There is a chance that this can be better formatted, but as the
    first release, using .ljust() to make sure each section of strings have the
    same length.
    """
    blocks = [
        {"type": "section", "text": {"type": "mrkdwn", "text": "*Leaderboard*"}}
    ]
    table = Texttable()
    table.header(["Username", "Wins", "Losses", "Win%"])
    table.set_cols_align(["l", "r", "r", "r"])
    table.add_rows(
        (
            [
                player_data["username"],
                player_data["match_win_count"],
                player_data["match_loss_count"],
                "{:.3f}".format(player_data["match_win_pct"]),
            ]
            for player_data in PlayerSummarySerializer(
                Player.objects.annotate_stats().order_by(
                    "-match_win_pct", "-match_count"
                ),
                many=True,
            ).data
        ),
        header=False,
    )
    blocks.append(
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": f"```{table.draw()}```"},
        }
    )
    return {"response_type": "in_channel", "blocks": blocks}


def error_response(request, *args, **kwargs):
    """
    Return a slack error message
    """
    return {
        "response_type": "in_channel",
        "text": "Sorry, that operation is not supported. Please try again.",
    }


def run_cmd(request, *args, **kwargs):
    parser = SlackArgumentParser(
        prog=request.data.get("command"), description="Rock Paper Scissors!"
    )
    subparsers = parser.add_subparsers(help="sub-command help")

    parser_new_match = subparsers.add_parser("new", help="Create a new match")
    parser_new_match.set_defaults(func=new_match)
    parser_new_match.add_argument(
        "--best-of", "-b", type=int, help="Max number of non-tie games"
    )
    parser_new_match.add_argument(
        "--lizard-spock",
        "-l",
        action="store_true",
        dest="extended_mode",
        help="Enable lizard & spock",
    )
    parser_new_match.add_argument(
        "--private",
        action="store_false",
        dest="public",
        help="Make the match private, so it won't be on the public list",
    )

    parser_leaderboard = subparsers.add_parser(
        "leaderboard", aliases=["lb"], help="Show the leaderboard"
    )
    parser_leaderboard.set_defaults(func=leaderboard)

    arg_strs = re.split(r"\s+", request.data.get("text", "").strip())
    try:
        args = parser.parse_args(arg_strs)
    except ArgumentParserError as e:
        return {"response_type": "in_channel", "text": str(e)}

    # Get the function based on subcommand, and call it with the other args
    # Remove unspecified args so we can rely on the serializers' defaults
    argd = {k: v for k, v in vars(args).items() if v is not None}
    func = argd.pop("func")
    return func(request, argd)


class SlackIntegrationView(APIView):
    """
    Slack integration only hits one API endpoint, but with different payloads.
    Hence implement this view with a bunch of response generators to keep logic
    organized
    """

    permission_classes = []  # This API view doesn"t need to check CSRF

    def post(self, request, *args, **kwargs):
        """
        For now there is only one type of slack integration, which is to
        generate a new match.

        In the future if we include more workflow like `/rps leaderboard`,
        we can parse the message here and return different type of responses.
        """

        # Get the function based on subcommand, and call it with the other args
        return Response(run_cmd(request, *args, **kwargs))
