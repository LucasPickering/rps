import { Box, LinearProgress, Typography } from '@material-ui/core';
import { last } from 'lodash';
import React, { useContext } from 'react';
import { ClientMessageType, LiveMatchContext } from 'state/livematch';
import { formatGameOutcome, formatMatchOutcome } from 'util/format';
import GameLog from './GameLog';
import MoveButtons from './MoveButtons';
import PlayerScore from './PlayerScore';

/**
 * Helper component to render the actions available to the player
 */
const Actions: React.FC = () => {
  const {
    state: { isGameInProgress, selectedMove, matchOutcome, games },
    sendMessage,
  } = useContext(LiveMatchContext);
  // Match is running
  if (isGameInProgress) {
    if (selectedMove) {
      return (
        <>
          <Typography variant="h5">Waiting for opponent to go...</Typography>
          <LinearProgress />
        </>
      );
    }
    return (
      <MoveButtons
        onClick={move => {
          sendMessage({ type: ClientMessageType.Move, move });
        }}
      />
    );
  }

  // Match is over
  if (matchOutcome) {
    return (
      <>
        <Typography variant="h5">Match Over</Typography>
        <Typography variant="h3">
          You {formatMatchOutcome(matchOutcome)}
        </Typography>
      </>
    );
  }
  const lastGame = last(games);
  if (lastGame) {
    return (
      <Typography>
        Game Over. You {formatGameOutcome(lastGame.outcome)}.
      </Typography>
    );
  }
  // Shouldn't ever get here (ecks dee)
  return null;
};

const LiveMatch: React.FC = () => {
  const {
    state: { opponent },
  } = useContext(LiveMatchContext);
  // No opponent
  if (!opponent) {
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h5">Waiting for opponent to connect...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <PlayerScore isSelf />
        <GameLog />
        <PlayerScore />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Actions />
      </Box>
    </>
  );
};

export default LiveMatch;
