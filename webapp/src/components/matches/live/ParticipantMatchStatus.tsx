import { Typography } from '@material-ui/core';
import useSplashMessage, { matchOutcomeSplashes } from 'hooks/useSplashMessage';
import { last } from 'lodash';
import React, { useContext, useEffect } from 'react';
import { LiveMatchDataContext } from 'state/livematch';
import { formatGameOutcome, formatMatchOutcome } from 'util/format';
import useStyles from 'hooks/useStyles';
import useNotifications from 'hooks/useNotifications';
import { GameOutcome, Game } from 'state/match';
import { User } from 'state/user';
import useLiveMatchStyles from './useLiveMatchStyles';
import { makeMatchLink } from 'util/routes';
import Link from 'components/common/Link';

/**
 * Game and match status messages for a participant. Nothing interactive here.
 */
const ParticipantMatchStatus: React.FC<{
  user: User;
}> = ({ user }) => {
  const classes = useStyles();
  const liveMatchClasses = useLiveMatchStyles();
  const { players, games, permanentMatch, winner } = useContext(
    LiveMatchDataContext
  );

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
    matchOutcomeSplashes,
    matchOutcome
  );

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

  // Match is over (these two will always be defined together)
  if (permanentMatch && winner) {
    return (
      <>
        <Link to={makeMatchLink(permanentMatch)}>
          <Typography className={liveMatchClasses.normalMessage}>
            Match Over
          </Typography>
        </Link>
        <Typography className={liveMatchClasses.majorMessage}>
          You {formatMatchOutcome(matchOutcome, 'past')}!
        </Typography>
        <Typography className={classes.caption}>
          {matchOutcomeSplash}
        </Typography>
      </>
    );
  }

  // Not ready yet, show a ready button
  const lastGame = last(games);
  if (!self.isReady && lastGame) {
    return (
      <Typography className={liveMatchClasses.normalMessage}>
        {formatGameOutcome(getGameOutcome(lastGame))}
      </Typography>
    );
  }
  return null;
};

export default ParticipantMatchStatus;
