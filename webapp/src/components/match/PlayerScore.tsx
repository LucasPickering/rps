import { Box, makeStyles, Theme, Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { GameOutcome, MatchContext } from 'state/match';
import { countGameOutcomes } from 'util/funcs';

const useLocalStyles = makeStyles(({  }: Theme) => ({
  root: {
    // Use a fixed width here so that the game log will be exactly centered
    width: 120,
  },
  rtl: {
    // Need this so we overflow to the left
    direction: 'rtl',
  },
}));

interface Props {
  className?: string;
  isSelf: boolean;
}

// We have to leave the React.FC tag off to get default props to work
const PlayerScore = ({ className, isSelf }: Props) => {
  const localClasses = useLocalStyles();
  const {
    state: { games, opponent },
  } = useContext(MatchContext);

  const num = countGameOutcomes(
    games,
    isSelf ? GameOutcome.Win : GameOutcome.Loss
  );
  const name = isSelf ? 'You' : opponent ? opponent.name : 'No Opponent';

  return (
    <Box
      className={classNames(localClasses.root, className, {
        [localClasses.rtl]: !isSelf,
      })}
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h5" noWrap>
        {name}
      </Typography>
      <Typography variant="h4">{num}</Typography>
    </Box>
  );
};

PlayerScore.defaultProps = {
  isSelf: false,
};

export default PlayerScore;
