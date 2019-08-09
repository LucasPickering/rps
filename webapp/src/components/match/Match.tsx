import { Box, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import { MatchContext } from 'state/match';
import GameLog from './GameLog';
import MoveButtons from './MoveButtons';
import PlayerScore from './PlayerScore';

/**
 * Helper component to render the actions available to the player
 */
const MatchActions: React.FC = () => {
  const {
    state: { gameInProgress, selectedMove, matchOutcome, gameLog },
    send,
  } = useContext(MatchContext);
  // Game is running
  if (gameInProgress) {
    if (selectedMove) {
      return <div>Waiting for opponent to go</div>; // TODO
    }
    return (
      <MoveButtons
        onClick={move => {
          send({ type: 'move', move });
        }}
      />
    ); // TODO
  }

  // Game is over
  if (matchOutcome) {
    return <div>Match over</div>; // TODO
  }
  if (!isEmpty(gameLog)) {
    const lastGame = gameLog[gameLog.length - 1];
    return <Typography>Game Over. You {lastGame}.</Typography>;
  }
  // Shouldn't ever get here (ecks dee)
  return null;
};

const Match: React.FC = () => {
  // TODO uncomment this
  // No opponent
  // if (!state.opponentName) {
  //   return <p>Waiting for opponent...</p>; // TODO
  // }

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
