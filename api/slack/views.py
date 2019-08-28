from rest_framework.views import APIView
from rest_framework.response import Response

from core.util import get_livematch_id


class SlackIntegrationView(APIView):
    permission_classes = []  # This API view doesn't need to check CSRF

    def post(self, request, *args, **kwargs):
        """
        For now there is only one type of slack integration, which is to generate a new match.

        In the future if we include more workflow like `/rps leaderboard`,
        we can parse the message here and return different type of responses.
        """
        return Response(
            {
                "response_type": "in_channel",
                "text": request.build_absolute_uri(
                    "/matches/live/{}".format(get_livematch_id())
                ),
                "attachments": [{"text": "Let the battle begin!"}],
            }
        )
