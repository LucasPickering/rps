import { Button } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';

const moveLabels = {
  [Move.Rock]: 'Rock',
  [Move.Paper]: 'Paper',
  [Move.Scissors]: 'Scissors',
  [Move.Lizard]: 'Lizard',
  [Move.Spock]: 'Spock',
};

interface Props extends React.ComponentProps<typeof Button> {
  move: Move;
}

// TODO make this pretty
const MoveIcon: React.FC<Props> = ({ move }) => <p>{moveLabels[move]}</p>;

export default MoveIcon;
