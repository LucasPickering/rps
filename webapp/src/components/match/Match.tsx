import { Box, Typography } from '@material-ui/core';
import { last } from 'lodash';
import React, { useContext } from 'react';
import { ClientMessageType, MatchContext } from 'state/match';
import GameLog from './GameLog';
import MoveButtons from './MoveButtons';
import PlayerScore from './PlayerScore';

/**
 * Helper component to render the actions available to the player
 */
const MatchActions: React.FC = () => {
  const {
    state: { isGameInProgress, selectedMove, matchOutcome, games },
    sendMessage,
  } = useContext(MatchContext);
  // Match is running
  if (isGameInProgress) {
    if (selectedMove) {
      return <div>Waiting for opponent to go</div>; // TODO
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
    return <div>Match over</div>; // TODO
  }
  const lastGame = last(games);
  if (lastGame) {
    return <Typography>Game Over. You {lastGame.outcome}.</Typography>;
  }
  // Shouldn't ever get here (ecks dee)
  return null;
};

const Match: React.FC = () => {
  const {
    state: { opponent },
  } = useContext(MatchContext);
  // No opponent
  if (!opponent) {
    return <p>Waiting for opponent...</p>; // TODO
  }

  return (
    <>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <PlayerScore isSelf />
        <GameLog />
        <PlayerScore />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <MatchActions />
      </Box>
    </>
  );
};

export default Match;
