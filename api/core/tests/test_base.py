from django.test import TestCase

from .. import models


class RpsTestCase(TestCase):
    fixtures = ["init"]

    def setUp(self):
        qs = models.Player.objects.annotate_match_outcomes()
        self.player1 = qs.get(username="user1")
        self.player2 = qs.get(username="user2")
        self.player3 = qs.get(username="user3")
