from rest_framework.test import APIClient

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
