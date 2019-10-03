from django.contrib.auth.models import AnonymousUser

from core.tests.test_base import RpsTestCase
from core.tests.factories import MatchConfigFactory
from core.util import Move

from ..error import ClientError, ClientErrorType
from ..models import LiveMatch


class LiveMatchTestCase(RpsTestCase):
    def setUp(self):
        super().setUp()
        self.config = MatchConfigFactory()
        self.live_match = LiveMatch.objects.create(config=self.config)
        self.live_match.player_join(self.player1)
        self.live_match.player_join(self.player2)

    def test_is_game_complete(self):
        self.assertFalse(self.live_match.is_game_complete)
        self.live_match.apply_move(self.player1, Move.ROCK.value)
        self.assertFalse(self.live_match.is_game_complete)
        self.live_match.apply_move(self.player2, Move.ROCK.value)
        self.assertTrue(self.live_match.is_game_complete)

    def test_is_match_started(self):
        lm = LiveMatch.objects.create(config=self.config)
        self.assertFalse(lm.is_match_started)
        lm.player_join(self.player1)
        self.assertFalse(lm.is_match_started)
        lm.player_join(self.player2)
        self.assertTrue(lm.is_match_started)

    def test_is_participant(self):
        self.assertTrue(self.live_match.is_participant(self.player1))
        self.assertTrue(self.live_match.is_participant(self.player2))
        self.assertFalse(self.live_match.is_participant(self.player3))

    def test_player_join(self):
        lm = LiveMatch.objects.create(config=self.config)
        self.assertEqual(lm.player1, None)
        self.assertEqual(lm.player2, None)

        # Player enters the first slot
        self.assertEqual(lm.player_join(self.player1), True)
        self.assertEqual(lm.player1.player, self.player1)
        self.assertEqual(lm.player2, None)
        p1_join_time = lm.player1.last_activity

        # Joining the same player just updates their last_activity
        self.assertEqual(lm.player_join(self.player1), True)
        self.assertEqual(lm.player1.player, self.player1)
        self.assertEqual(lm.player2, None)
        self.assertGreater(
            lm.player1.last_activity,
            p1_join_time,
            "last_activity was not updated after second join for player",
        )

        # Adding a second player fills the second slot
        self.assertEqual(lm.player_join(self.player2), True)
        self.assertEqual(lm.player1.player, self.player1)
        self.assertEqual(lm.player2.player, self.player2)

        # Adding a third player does nothing
        self.assertEqual(lm.player_join(self.player3), False)
        self.assertEqual(lm.player1.player, self.player1)
        self.assertEqual(lm.player2.player, self.player2)

        # Make sure all the changes were written to the DB
        lm_requery = LiveMatch.objects.get(id=lm.id)
        self.assertEqual(
            lm_requery, lm, "LiveMatch changes were not saved to DB"
        )

    def test_player_join_anon(self):
        # Joining an anonymous user on an empty match does nothing
        lm = LiveMatch.objects.create(config=self.config)
        self.assertEqual(lm.player_join(AnonymousUser()), False)
        self.assertEqual(lm.player1, None)
        self.assertEqual(lm.player2, None)

    def test_heartbeat(self):
        p1_last_activity = self.live_match.player1.last_activity
        p2_last_activity = self.live_match.player2.last_activity
        self.live_match.heartbeat(self.player1)

        # Re-query to make sure changes were saved to the DB
        lm = LiveMatch.objects.get(id=self.live_match.id)
        self.assertGreater(
            lm.player1.last_activity,
            p1_last_activity,
            "heartbeat did not update last_activity",
        )
        self.assertEqual(
            lm.player2.last_activity,
            p2_last_activity,
            "heartbeat updated last_activity for another player",
        )

    def test_heartbeat_not_in_match(self):
        with self.assertRaises(ClientError) as cm:
            self.live_match.heartbeat(self.player3)
        self.assertEqual(cm.exception._error_type, ClientErrorType.NOT_IN_MATCH)

    def test_ready_up(self):
        self.live_match.player1.is_ready = False
        self.live_match.player1.save()
        self.live_match.ready_up(self.player1)
        self.assertTrue(self.live_match.player1)

    def test_ready_up_not_in_match(self):
        with self.assertRaises(ClientError) as cm:
            self.live_match.ready_up(self.player3)
        self.assertEqual(cm.exception._error_type, ClientErrorType.NOT_IN_MATCH)

    def test_apply_move(self):
        self.live_match.apply_move(self.player1, Move.ROCK.value)
        self.assertEqual(
            LiveMatch.objects.get(id=self.live_match.id).player1.move,
            Move.ROCK.value,
        )
        self.live_match.apply_move(self.player2, Move.ROCK.value)

    def test_apply_move_invalid_move(self):
        with self.assertRaises(ClientError) as cm:
            self.live_match.apply_move(self.player3, "gun")
        self.assertEqual(cm.exception._error_type, ClientErrorType.INVALID_MOVE)

    def test_apply_move_not_in_match(self):
        with self.assertRaises(ClientError) as cm:
            self.live_match.apply_move(self.player3, Move.ROCK.value)
        self.assertEqual(cm.exception._error_type, ClientErrorType.NOT_IN_MATCH)

    def test_apply_move_already_applied(self):
        pass  # TODO

    def test_apply_move_not_ready(self):
        pass  # TODO

    def test_full_match(self):
        """
        Tests the complete flow of a match
        """
        lm = LiveMatch.objects.create(config=self.config)

        # player_join
        lm.player_join(self.player1)  # player 1
        lm.player_join(self.player2)  # player 2
        self.assertTrue(lm.is_match_started)
        self.assertFalse(self.live_match.is_match_complete)

        # players start off ready
        self.assertTrue(lm.player1.is_ready)
        self.assertTrue(lm.player2.is_ready)

        # game 1 (0-0)
        lm.apply_move(self.player1, Move.ROCK.value)
        lm.apply_move(self.player2, Move.PAPER.value)
        self.assertTrue(lm.is_game_complete)

        # intermission
        self.assertEqual(lm.player1.move, Move.ROCK.value)
        self.assertEqual(lm.player2.move, Move.PAPER.value)
        self.assertFalse(lm.player1.is_ready)
        self.assertFalse(lm.player2.is_ready)

        # ready up
        lm.ready_up(self.player1)
        self.assertTrue(lm.is_game_complete)
        lm.ready_up(self.player2)
        self.assertFalse(lm.is_game_complete)

        self.assertEqual(lm.player1.move, "")
        self.assertEqual(lm.player2.move, "")
        game1 = lm.games.last()
        self.assertEqual(game1.game_num, 0)  # lul numbers
        self.assertEqual(game1.winner, self.player2)

        # game 2 (0-1)
        lm.apply_move(self.player1, Move.PAPER.value)
        lm.apply_move(self.player2, Move.PAPER.value)
        game2 = lm.games.last()
        self.assertEqual(game2.game_num, 1)
        self.assertEqual(game2.winner, None)

        # intermission
        lm.ready_up(self.player1)
        lm.ready_up(self.player2)

        # game 3 (0-1)
        lm.apply_move(self.player1, Move.ROCK.value)
        lm.apply_move(self.player2, Move.SCISSORS.value)
        game3 = lm.games.last()
        self.assertEqual(game3.game_num, 2)
        self.assertEqual(game3.winner, self.player1)

        # intermission
        lm.ready_up(self.player1)
        lm.ready_up(self.player2)

        # game 4 (1-1)
        lm.apply_move(self.player1, Move.PAPER.value)
        lm.apply_move(self.player2, Move.SCISSORS.value)
        game4 = lm.games.last()
        self.assertEqual(game4.game_num, 3)
        self.assertEqual(game4.winner, self.player2)

        # match over
        self.assertTrue(lm.is_match_complete)
        match = lm.permanent_match
        self.assertEqual(match.config, lm.config)
        self.assertEqual(match.winner, self.player2)

        # rematch
        lm.accept_rematch(self.player1)
        self.assertTrue(lm.player1.accepted_rematch)
        self.assertFalse(lm.player2.accepted_rematch)
        self.assertEqual(lm.rematch, None)

        lm.accept_rematch(self.player2)
        self.assertTrue(lm.player1.accepted_rematch)
        self.assertTrue(lm.player2.accepted_rematch)
        self.assertNotEqual(lm.rematch, None)
