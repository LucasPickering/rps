import { makeStyles, Grid, IconButton } from '@material-ui/core';
import React, { useContext } from 'react';
import { Move } from 'state/match';
import MoveIconCircle from './MoveIconCircle';
import useScreenSize, { ScreenSize } from 'hooks/useScreenSize';
import clsx from 'clsx';
import { LiveMatchContext } from 'state/livematch';

const useLocalStyles = makeStyles(({ spacing }) => ({
  base: {
    display: 'flex',
    '& > button': {
      margin: spacing(1),
    },
  },
  extended: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gridTemplateAreas: `
    '.. .. ro .. ..'
    'li .. .. .. pa'
    '.. sp .. sc ..'
    `,
  },
  small: {
    gridRowGap: 0,
  },
  large: {
    gridRowGap: 48,
  },
  button: {
    padding: 0,
  },
}));

const baseMoves = [Move.Rock, Move.Paper, Move.Scissors];
const extendedMoves = baseMoves.concat(Move.Lizard, Move.Spock);

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
  const screenSize = useScreenSize();
  const {
    config: { extendedMode },
  } = useContext(LiveMatchContext);
  const moves = extendedMode ? extendedMoves : baseMoves;

  return (
    <Grid
      className={clsx(
        extendedMode ? localClasses.extended : localClasses.base,
        screenSize === ScreenSize.Large
          ? localClasses.large
          : localClasses.small
      )}
      item
    >
      {moves.map((move: Move) => (
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
