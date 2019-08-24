import { makeStyles, Grid, IconButton } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIconCircle from './MoveIconCircle';

const useLocalStyles = makeStyles(({ spacing }) => ({
  button: {
    margin: spacing(1),
    padding: 0,
  },
}));

interface Props {
  onClick: (move: Move) => void;
}

const MoveButtons: React.FC<Props> = ({ onClick }) => {
  const localClasses = useLocalStyles();
  return (
    <>
      {Object.values(Move).map((move: Move) => (
        <Grid key={move} item>
          <IconButton
            className={localClasses.button}
            onClick={() => onClick(move)}
          >
            <MoveIconCircle move={move} />
          </IconButton>
        </Grid>
      ))}
    </>
  );
};

export default MoveButtons;
