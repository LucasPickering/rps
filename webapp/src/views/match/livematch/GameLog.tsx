import { Typography, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { LiveMatchContext, LiveGame } from 'state/livematch';
import { GameOutcome } from 'state/match';
import { countGameOutcomes } from 'util/funcs';
import FlexBox from 'components/core/FlexBox';
import { range } from 'lodash';
import MoveIcon from 'components/MoveIcon';
import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
  Remove as IconRemove,
} from '@material-ui/icons';

const useLocalStyles = makeStyles(() => ({
  games: {
    display: 'grid',
    gridTemplateColumns: '24px 14px 24px 14px 24px',
    alignItems: 'center',
  },
  selfWin: {
    gridColumn: 1,
  },
  selfMoveIcon: {
    gridColumn: 2,
  },
  centerIcon: {
    gridColumn: 3,
  },
}));

const Game: React.FC<{ game?: LiveGame }> = ({ game }) => {
  const localClasses = useLocalStyles();
  return game ? (
    <>
      {game.outcome === GameOutcome.Win && (
        <IconChevronLeft className={localClasses.selfWin} />
      )}
      <MoveIcon className={localClasses.selfMoveIcon} move={game.selfMove} />
      <IconRemove className={localClasses.centerIcon} />
      <MoveIcon move={game.opponentMove} />
      {game.outcome === GameOutcome.Loss && <IconChevronRight />}
    </>
  ) : (
    <IconRemove className={localClasses.centerIcon} />
  );
};

// We have to leave the React.FC tag off to get default props to work
const GameLog: React.FC = () => {
  const localClasses = useLocalStyles();
  const {
    state: {
      data: { bestOf, games, matchOutcome },
    },
  } = useContext(LiveMatchContext);

  const nonTies = games.length - countGameOutcomes(games, GameOutcome.Tie);
  const maxRemainingGames = matchOutcome ? 0 : bestOf - nonTies;

  return (
    <FlexBox flexDirection="column" justifyContent="start">
      <Typography variant="h5">Best of {bestOf}</Typography>
      <div className={localClasses.games}>
        {games.map((game, i) => (
          <Game key={i} game={game} />
        ))}
        {range(maxRemainingGames).map(i => (
          <Game key={i} />
        ))}
      </div>
    </FlexBox>
  );
};

export default GameLog;
