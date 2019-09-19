from .test_base import RpsTestCase


class PlayerQuerySetTestCase(RpsTestCase):
    def test_win_pct(self):
        self.assertAlmostEqual(self.player1.match_win_pct, 0.4, delta=0.001)
        self.assertAlmostEqual(self.player2.match_win_pct, 0.6, delta=0.001)

        self.assertEqual(self.player3.match_count, 0)
        self.assertEqual(self.player3.match_win_pct, 0)
