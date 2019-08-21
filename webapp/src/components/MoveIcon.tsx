import { Typography, CircularProgress } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';

const moveLabels = {
  [Move.Rock]: 'Rock',
  [Move.Paper]: 'Paper',
  [Move.Scissors]: 'Scissors',
  [Move.Lizard]: 'Lizard',
  [Move.Spock]: 'Spock',
};

interface Props {
  move?: Move;
}

/**
 * An icon for a single move. If no move is specified, a loading icon is shown
 */
const MoveIcon: React.FC<Props> = ({ move }) =>
  move ? (
    <Typography>{moveLabels[move]}</Typography>
  ) : (
    <CircularProgress size={20} />
  );

export default MoveIcon;
