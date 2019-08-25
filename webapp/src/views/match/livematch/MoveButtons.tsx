import { makeStyles, Grid, IconButton } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIconCircle from './MoveIconCircle';

const useLocalStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gridRowGap: 60,
    gridTemplateAreas: `
    '.. .. ro .. ..'
    'li .. .. .. pa'
    '.. sp .. sc ..'
    `,
  },
  button: {
    margin: spacing(1),
    padding: 0,
  },
}));

const areaMapping = {
  [Move.Rock]: 'ro',
  [Move.Paper]: 'pa',
  [Move.Scissors]: 'sc',
  [Move.Lizard]: 'li',
  [Move.Spock]: 'sp',
};

interface Props {
  disabled: boolean;
  onClick: (move: Move) => void;
}

const MoveButtons = ({ disabled, onClick }: Props): React.ReactElement => {
  const localClasses = useLocalStyles();
  return (
    <Grid className={localClasses.root} item>
      {Object.values(Move).map((move: Move) => (
        <IconButton
          key={move}
          className={localClasses.button}
          disabled={disabled}
          style={{ gridArea: areaMapping[move] }}
          onClick={() => onClick(move)}
        >
          <MoveIconCircle move={move} />
        </IconButton>
      ))}
    </Grid>
  );
};

MoveButtons.defaultProps = {
  disabled: false,
};

export default MoveButtons;
