import { Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import useSplashMessage, { matchOutcomeSplasher } from 'hooks/useSplashMessage';
import { last } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { ClientMessageType, LiveMatchContext } from 'state/livematch';
import { formatGameOutcome, formatMatchOutcome } from 'util/format';
import MoveButtons from './MoveButtons';
import useStyles from 'hooks/useStyles';
import useNotifications from 'hooks/useNotifications';
import { Redirect } from 'react-router';
import { GameOutcome, Game } from 'state/match';
import { User } from 'state/user';

/**
 * Helper component to render the actions available to the player. This should
 * only be rendered for participants. It takes user and player1 as props even
 * though those are available via context so that it can assert that they're
 * non-null.
 */
const ParticipantActions: React.FC<{
  user: User;
}> = ({ user }) => {
  const classes = useStyles();
  const {
    data: { players, games, winner, rematch },
    sendMessage,
  } = useContext(LiveMatchContext);

  const self = players.find(player => player.username === user.username);
  const opponent = players.find(player => player.username !== user.username);

  // Makes the rest of the logic easier
  if (!self) {
    throw new Error(
      `Player ${user.username} is not in match, but is marked as participant`
    );
  }

  const matchOutcome = winner && winner === self.username ? 'win' : 'loss';

  /**
   * Gets the outcome of the given game, as win/loss/tie
   */
  const getGameOutcome = (game: Game): GameOutcome => {
    if (game.winner === self.username) {
      return 'win';
    }
    if (!game.winner) {
      return 'tie';
    }
    return 'loss';
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

  if (!opponent) {
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
