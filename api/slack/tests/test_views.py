from django.contrib.auth.models import Group
from rest_framework.test import APIClient

from core.tests.factories import match_factory
from core.tests.test_base import RpsTestCase


class SlackViewTestCase(RpsTestCase):
    """
    These tests are mostly just sanity checks to make sure the commands return
    200s
    """

    def setUp(self):
        super().setUp()
        self.client = APIClient()

    def test_new(self):
        resp = self.client.post(
            "/api/slack/",
            {"command": "rps", "text": "new --best-of 5 --lizard-spock"},
            format="json",
        )

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertRegex(data["text"], r"/matches/live/[0-9a-f]+$")

    def test_leaderboard(self):
        resp = self.client.post(
            "/api/slack/",
            {"command": "rps", "text": "leaderboard"},
            format="json",
        )

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("blocks", data)

    def test_leaderboard_with_group(self):
        group = Group.objects.create(name="asdf")
        group.user_set.add(self.player1, self.player2)

        resp = self.client.post(
            f"/api/slack/?group__name={group.name}",
            {"command": "rps", "text": "leaderboard"},
            format="json",
        )
        data = resp.json()
        table = data["blocks"][1]["text"]["text"]

        # Only players in the group are shown
        self.assertIn(self.player1.username, table)
        self.assertIn(self.player2.username, table)
        self.assertNotIn(self.player3.username, table)

    def test_leaderboard_with_unknown_group(self):
        resp = self.client.post(
            "/api/slack/?group__name=asdf",
            {"command": "rps", "text": "leaderboard"},
            format="json",
        )
        data = resp.json()
        table = data["blocks"][1]["text"]["text"]

        # All players are shown
        self.assertIn(self.player1.username, table)
        self.assertIn(self.player2.username, table)
        self.assertIn(self.player3.username, table)
