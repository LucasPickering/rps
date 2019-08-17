import { Box, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { LiveMatchContext } from 'state/livematch';
import { GameOutcome } from 'state/match';
import { countGameOutcomes } from 'util/funcs';

const outcomeLabel = {
  [GameOutcome.Win]: 'W',
  [GameOutcome.Loss]: 'L',
  [GameOutcome.Tie]: 'T',
};

interface Props {}

// We have to leave the React.FC tag off to get default props to work
const GameLog: React.FC<Props> = () => {
  const {
    state: { bestOf, games, matchOutcome },
  } = useContext(LiveMatchContext);

  const nonTies = games.length - countGameOutcomes(games, GameOutcome.Tie);
  const maxRemainingGames = matchOutcome ? 0 : bestOf - nonTies;
  const gameLogStr = games
    .map(({ outcome }) => outcomeLabel[outcome])
    .concat(Array(maxRemainingGames).fill('–'))
    .join(' ');

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="start"
      textAlign="center"
    >
      <Typography variant="h5">Best of {bestOf}</Typography>
      <Typography variant="body1">{gameLogStr}</Typography>
    </Box>
  );
};

export default GameLog;
