import { Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import useSplashMessage, { matchOutcomeSplasher } from 'hooks/useSplashMessage';
import { last } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import {
  ClientMessageType,
  LiveMatchContext,
  LivePlayerMatch,
} from 'state/livematch';
import { formatGameOutcome, formatMatchOutcome } from 'util/format';
import MoveButtons from './MoveButtons';
import useStyles from 'hooks/useStyles';
import useNotifications from 'hooks/useNotifications';
import { Redirect } from 'react-router';
import { getSelfAndOpponent } from 'util/funcs';
import { MatchOutcome, GameOutcome, Game } from 'state/match';
import { User } from 'state/user';

/**
 * Helper component to render the actions available to the player. This should
 * only be rendered for participants. It takes user and player1 as props even
 * though those are available via context so that it can assert that they're
 * non-null.
 */
const ParticipantActions: React.FC<{
  user: User;
  player1: LivePlayerMatch;
}> = ({ user, player1 }) => {
  const classes = useStyles();
  const {
    data: { player2, games, winner, rematch },
    sendMessage,
  } = useContext(LiveMatchContext);

  const [self, opponent] = getSelfAndOpponent(user, player1, player2);
  const matchOutcome =
    winner === self.username ? MatchOutcome.Win : MatchOutcome.Loss;

  /**
   * Gets the outcome of the given game, as win/loss/tie
   */
  const getGameOutcome = (game: Game): GameOutcome => {
    if (game.winner === self.username) {
      return GameOutcome.Win;
    }
    if (!game.winner) {
      return GameOutcome.Tie;
    }
    return GameOutcome.Loss;
  };

  const matchOutcomeSplash = useSplashMessage(
    matchOutcomeSplasher,
    matchOutcome
  );
  const [acceptedRematch, setAcceptedRematch] = useState(false);

  // Handle notifications here since we know the player is a participant
  const notify = useNotifications();
  // Notification for when opponent first connects
  const opponentName = opponent && opponent.username;
  useEffect(() => {
    if (opponentName) {
      notify(`${opponentName} connected`);
    }
  }, [notify, opponentName]);

  // Notitication for end of game
  useEffect(() => {
    const lastGame = last(games);
    if (lastGame) {
      notify(
        `Game over - ${formatGameOutcome(getGameOutcome(lastGame), 'noun')}`
      );
    }
  }, [notify, games.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (acceptedRematch && rematch) {
    return <Redirect to={`/matches/live/${rematch}`} />;
  }

  if (!user || !player1 || !player2) {
    // Still waiting on a player, don't show anything yet
    return null;
  }

  // Match is over
  if (winner) {
    return (
      <>
        <Typography className={classes.normalMessage}>Match Over</Typography>
        <Typography className={classes.majorMessage}>
          You {formatMatchOutcome(matchOutcome, 'past')}!
        </Typography>
        <Typography className={classes.minorMessage}>
          {matchOutcomeSplash}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (!rematch) {
              sendMessage({ type: ClientMessageType.Rematch });
            }
            setAcceptedRematch(true);
          }}
        >
          Rematch
        </Button>
      </>
    );
  }

  // Match is running
  if (!self.move) {
    // Player is ready, show moves
    return (
      <MoveButtons
        disabled={!opponent}
        onClick={move => {
          sendMessage({ type: ClientMessageType.Move, move });
        }}
      />
    );
  }

  // Not ready yet, show a ready button
  if (self.isReady) {
    return (
      <Grid item>
        <CircularProgress />
      </Grid>
    );
  } else {
    const lastGame = last(games);

    return (
      <>
        {lastGame && (
          <Grid item>
            <Typography className={classes.normalMessage}>
              {formatGameOutcome(getGameOutcome(lastGame))}
            </Typography>
          </Grid>
        )}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => sendMessage({ type: ClientMessageType.Ready })}
          >
            Ready
          </Button>
        </Grid>
      </>
    );
  }
};

export default ParticipantActions;
