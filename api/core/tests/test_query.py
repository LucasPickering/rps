from django.contrib.auth.models import Group
from core.tests.factories import match_factory

from ..models import Player
from ..util import avg
from .test_base import RpsTestCase


class PlayerQuerySetTestCase(RpsTestCase):
    def setUp(self):
        super().setUp()
        for i in range(5):
            match_factory(
                self.player1,
                self.player2,
                self.player1 if i < 2 else self.player2,
            )

    def test_win_pct_no_matches(self):
        p3 = Player.objects.annotate_stats().get(id=self.player3.id)
        self.assertEqual(p3.match_count, 0)
        self.assertEqual(p3.match_win_pct, 0)

    def test_win_pct(self):
        qs = Player.objects.annotate_stats()
        self.assertAlmostEqual(
            qs.get(id=self.player1.id).match_win_pct, 0.4, delta=0.001
        )
        self.assertAlmostEqual(
            qs.get(id=self.player2.id).match_win_pct, 0.6, delta=0.001
        )

    def test_annotate_stats_group_filter(self):
        self.group = Group.objects.create()
        self.group.user_set.add(self.player1, self.player2)
        match_factory(self.player1, self.player3, self.player1)
        qs = Player.objects.annotate_stats(group_id=self.group.id)

        player1 = qs.get(id=self.player1.id)
        self.assertEqual(player1.match_count, 5)
        self.assertEqual(player1.match_win_count, 2)
        self.assertEqual(player1.match_loss_count, 3)
        self.assertEqual(player1.match_win_pct, 0.4)

        player2 = qs.get(id=self.player2.id)
        self.assertEqual(player2.match_count, 5)
        self.assertEqual(player2.match_win_count, 3)
        self.assertEqual(player2.match_loss_count, 2)
        self.assertEqual(player2.match_win_pct, 0.6)

        player3 = qs.get(id=self.player3.id)
        self.assertEqual(player3.match_count, 0)
        self.assertEqual(player3.match_win_count, 0)
        self.assertEqual(player3.match_loss_count, 0)
        self.assertEqual(player3.match_win_pct, 0)

    def test_rpi_no_matches(self):
        p3 = Player.objects.annotate_stats().get(id=self.player3.id)
        self.assertEqual(p3.rpi, 0.0)

    def test_rpi_no_opponent_matches(self):
        # player1 has only one opponent, so OWP and OOWP will be 0
        p1 = Player.objects.annotate_stats().get(id=self.player1.id)
        self.assertAlmostEqual(p1.rpi, p1.match_win_pct * 0.24, delta=0.001)

    def test_rpi_no_opponent_opponent_matches(self):
        match_factory(self.player2, self.player3, self.player2)
        # ^^ this match is the only one that contibutes to OWP (gives p2 a 1.0)

        # OWP: player2 is 1-0
        # OOWP will still be 0 here
        p1 = Player.objects.annotate_stats().get(id=self.player1.id)
        self.assertAlmostEqual(
            p1.rpi, p1.match_win_pct * 0.24 + 1.0 * 0.21, delta=0.001
        )

    def test_rpi_three_vectors(self):
        # OWP and OOWP are both defined here
        match_factory(self.player2, self.player3, self.player2)
        match_factory(self.player4, self.player1, self.player4)
        match_factory(self.player4, self.player2, self.player4)
        match_factory(self.player3, self.player4, self.player3)
        # player5 will have no matches for OWP, so they will be excluded from
        # the avg - this verifies that they get excluded from OWP instead of
        # counting as 0
        match_factory(self.player1, self.player5, self.player1)

        p1 = Player.objects.annotate_stats().get(id=self.player1.id)
        expected_wp = p1.match_win_pct

        # OWP: player2 is 1-1, player4 is 2-1, player5 has no other matches
        expected_owp = (0.5 + 0.5) / 2

        # OOWP:
        #   player2: 1-1 vs player1, 1-0 vs player3, 1-1 vs player4
        #   player4: 3-3 vs player1, 4-2 vs player2, 0-1 vs player3
        #   player5: 2-4 via player1
        expected_oowps = [
            (0.5 + 1.0 + 0.5) / 3,  # player2 OWP
            (0.5 + (4 / 6) + 0.0) / 3,  # player4 OWP
            2 / 6,  # player5 OWP
        ]
        expected_oowp = avg(expected_oowps)

        self.assertAlmostEqual(
            p1.rpi,
            (expected_wp * 0.24)
            + (expected_owp * 0.21)
            + (expected_oowp * 0.54),
            delta=0.001,
        )
