from django.test import TestCase

from .factories import UserFactory


class RpsTestCase(TestCase):
    def setUp(self):
        self.player1 = UserFactory(username="user1")
        self.player2 = UserFactory(username="user2")
        self.player3 = UserFactory(username="user3")
        self.player4 = UserFactory(username="user4")
        self.player5 = UserFactory(username="user5")
