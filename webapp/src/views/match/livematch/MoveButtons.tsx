import { makeStyles, Grid, IconButton } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIcon from 'components/MoveIcon';

const useLocalStyles = makeStyles(({ palette, spacing }) => ({
  button: {
    margin: spacing(1),
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: palette.divider,
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
            <MoveIcon move={move} />
          </IconButton>
        </Grid>
      ))}
    </>
  );
};

export default MoveButtons;
