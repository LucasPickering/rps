import { Box, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { GameOutcome, MatchContext } from 'state/match';
import { countGameOutcomes } from 'util/funcs';

interface Props {
  isSelf: boolean;
}

// We have to leave the React.FC tag off to get default props to work
const PlayerScore = ({ isSelf }: Props) => {
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
      display="flex"
      flexDirection="column"
      textAlign={isSelf ? 'left' : 'right'}
    >
      <Typography variant="h5">{name}</Typography>
      <Typography variant="body1">{num}</Typography>
    </Box>
  );
};

PlayerScore.defaultProps = {
  isSelf: false,
};

export default PlayerScore;
