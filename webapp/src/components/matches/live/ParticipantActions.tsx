import { Typography, Button, CircularProgress } from '@material-ui/core';
import React, { useContext } from 'react';
import {
  ClientMessageType,
  LiveMatchDataContext,
  LiveMatchSendMessageContext,
} from 'state/livematch';
import MoveButtons from './MoveButtons';
import useStyles from 'hooks/useStyles';
import { User } from 'state/user';
import { Redirect } from 'react-router';

const WaitingMessage: React.FC<{ message: string }> = ({ message }) => {
  const classes = useStyles();
  return (
    <>
      <CircularProgress />
      <Typography className={classes.caption}>
        Waiting for {message}...
      </Typography>
    </>
  );
};

/**
 * Helper component to render the actions available to the player. This should
 * only be rendered for participants. It takes user as a prop even though it's
 * are available via context so that it can assert that it's non-null.
 */
const ParticipantActions: React.FC<{
  user: User;
}> = ({ user }) => {
  const classes = useStyles();
  const { players, permanentMatch, winner, rematch } = useContext(
    LiveMatchDataContext
  );
  const sendMessage = useContext(LiveMatchSendMessageContext);

  const self = players.find(player => player.username === user.username);
  const opponent = players.find(player => player.username !== user.username);

  // Makes the rest of the logic easier
  if (!self) {
    throw new Error(
      `Player ${user.username} is not in match, but is marked as participant`
    );
  }

  if (!opponent) {
    // Still waiting on a player, don't show anything yet
    return null;
  }

  // If self and opponent have been accept a rematch, go to it
  if (rematch && self.acceptedRematch) {
    return <Redirect to={`/matches/live/${rematch}`} push />;
  }

  // Match is over (these two will always be defined together)
  if (permanentMatch && winner) {
    return (
      // No rematch created yet
      <>
        {self.acceptedRematch ? (
          <WaitingMessage message={`${opponent.username} to accept`} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => sendMessage({ type: ClientMessageType.Rematch })}
          >
            Rematch
          </Button>
        )}
        {opponent.acceptedRematch && (
          <Typography className={classes.caption}>
            {opponent.username} wants to rematch
          </Typography>
        )}
      </>
    );
  }

  // Match is running
  if (!self.move) {
    // Player is ready, show moves
    return <MoveButtons disabled={!opponent} />;
  }

  // Not ready yet, show a ready button
  if (!self.isReady) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => sendMessage({ type: ClientMessageType.Ready })}
      >
        Ready
      </Button>
    );
  }

  return (
    <WaitingMessage
      message={`${opponent.username} to ${opponent.move ? 'ready up' : 'go'}`}
    />
  );
};

export default ParticipantActions;
