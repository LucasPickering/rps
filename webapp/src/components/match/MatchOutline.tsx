import { Box } from '@material-ui/core';
import React from 'react';
import GameLog from './GameLog';
import PlayerScore from './PlayerScore';

/**
 * Outline component with visual data about the current match, such as score.
 * Shown during all states of a match.
 */
const MatchOutline: React.FC = ({ children }) => {
  return (
    <>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <PlayerScore isSelf />
        <GameLog />
        <PlayerScore />
      </Box>
      {children}
    </>
  );
};

export default MatchOutline;
