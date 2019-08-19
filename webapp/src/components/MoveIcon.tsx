import { Typography } from '@material-ui/core';
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
  move: Move;
}

// TODO make this pretty
const MoveIcon: React.FC<Props> = ({ move }) => (
  <Typography>{moveLabels[move]}</Typography>
);

export default MoveIcon;
