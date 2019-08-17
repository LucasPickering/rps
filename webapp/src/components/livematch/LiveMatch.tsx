import { Box } from '@material-ui/core';
import { last } from 'lodash';
import React, { useContext } from 'react';
import { ClientMessageType, LiveMatchContext } from 'state/livematch';
import { formatGameOutcome, formatMatchOutcome } from 'util/format';
import GameLog from './GameLog';
import LiveMatchStatusMessage from './LiveMatchStatusMessage';
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
        <LiveMatchStatusMessage minor="Waiting for opponent to go..." loading />
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
      <LiveMatchStatusMessage
        minor="Match Over"
        major={`You ${formatMatchOutcome(matchOutcome)}`}
      />
    );
  }
  const lastGame = last(games);
  if (lastGame) {
    return (
      <LiveMatchStatusMessage
        minor={`Game Over. You ${formatGameOutcome(lastGame.outcome)}.`}
      />
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
      <Box display="flex" flexDirection="column" alignItems="center">
        <LiveMatchStatusMessage
          minor="Waiting for opponent to connect..."
          loading
        />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <PlayerScore isSelf />
          <GameLog />
          <PlayerScore />
        </Box>
        <Actions />
      </Box>
    </>
  );
};

export default LiveMatch;
