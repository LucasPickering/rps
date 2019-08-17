import { Box, Button, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIcon from '../MoveIcon';

const useLocalStyles = makeStyles(({ spacing }: Theme) => ({
  button: { margin: spacing(1) },
}));

interface Props {
  onClick: (move: Move) => void;
}

const MoveButtons: React.FC<Props> = ({ onClick }) => {
  const localClasses = useLocalStyles();
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      width="100%"
    >
      {Object.values(Move).map((move: Move) => (
        <Button
          key={move}
          className={localClasses.button}
          variant="outlined"
          onClick={() => onClick(move)}
        >
          <MoveIcon move={move} />
        </Button>
      ))}
    </Box>
  );
};

export default MoveButtons;
