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
  disabled: boolean;
  onClick: (move: Move) => void;
}

const MoveButtons = ({ disabled, onClick }: Props): React.ReactElement => {
  const localClasses = useLocalStyles();
  return (
    <>
      {Object.values(Move).map((move: Move) => (
        <Grid key={move} item>
          <IconButton
            className={localClasses.button}
            disabled={disabled}
            onClick={() => onClick(move)}
          >
            <MoveIconCircle move={move} />
          </IconButton>
        </Grid>
      ))}
    </>
  );
};

MoveButtons.defaultProps = {
  disabled: false,
};

export default MoveButtons;
