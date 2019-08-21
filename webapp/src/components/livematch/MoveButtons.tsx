import { Button, makeStyles, Grid } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIcon from '../MoveIcon';

const useLocalStyles = makeStyles(({ spacing }) => ({
  button: { margin: spacing(1) },
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
          <Button
            className={localClasses.button}
            variant="outlined"
            onClick={() => onClick(move)}
          >
            <MoveIcon move={move} />
          </Button>
        </Grid>
      ))}
    </>
  );
};

export default MoveButtons;
