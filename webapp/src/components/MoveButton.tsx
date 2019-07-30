import { Button } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIcon from './MoveIcon';

interface Props extends React.ComponentProps<typeof Button> {
  move: Move;
}

const MoveButton: React.FC<Props> = ({ move, ...rest }) => (
  <Button {...rest}>
    <MoveIcon move={move} />
  </Button>
);

export default MoveButton;
