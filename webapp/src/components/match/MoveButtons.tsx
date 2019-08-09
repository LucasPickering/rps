import { Box, Button } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIcon from '../MoveIcon';

interface Props {
  onClick: (move: Move) => void;
}

const MoveButtons: React.FC<Props> = ({ onClick }) => (
  <Box>
    {Object.values(Move).map((move: Move) => (
      <Button onClick={() => onClick(move)}>
        <MoveIcon move={move} />
      </Button>
    ))}
  </Box>
);

export default MoveButtons;
