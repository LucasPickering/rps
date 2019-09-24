import { Typography, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import {
  LiveMatchDataContext,
  LiveMatchMetadataContext,
} from 'state/livematch';
import GameLog from '../GameLog';
import PlayerScore from './PlayerScore';
import MoveIconCircle from './MoveIconCircle';
import clsx from 'clsx';
import { sizeMq } from 'util/styles';

// Different classes based on screen size
const useLocalClasses = makeStyles(({ breakpoints }) => ({
  // Responsive design!
  score: {
    [sizeMq('small', breakpoints)]: {
      gridRow: 1,
    },
    [sizeMq('large', breakpoints)]: {
      gridRow: '1 / span 2',
    },
  },
  p1Score: {
    justifySelf: 'start',
    [sizeMq('small', breakpoints)]: {
      gridColumn: '1 / span 3',
    },
    [sizeMq('large', breakpoints)]: {
      gridColumn: '1 / span 2',
    },
  },
  p2Score: {
    justifySelf: 'end',
    [sizeMq('small', breakpoints)]: {
      gridColumn: '4 / span 3',
    },
    [sizeMq('large', breakpoints)]: {
      gridColumn: '5 / span 2',
    },
  },

  move: {
    [sizeMq('small', breakpoints)]: {
      gridRow: '2 / span 2',
    },
    [sizeMq('large', breakpoints)]: {
      gridRow: 3,
    },
  },
  p1Move: {
    justifySelf: 'start',
    gridColumn: 1,
  },
  p2Move: {
    justifySelf: 'end',
    gridColumn: 6,
  },

  centerColumn: {
    gridColumn: '3 / span 2',
  },
  bestOf: {
    [sizeMq('small', breakpoints)]: {
      gridRow: 2,
    },
    [sizeMq('large', breakpoints)]: {
      gridRow: 1,
    },
  },
  gameLog: {
    [sizeMq('small', breakpoints)]: {
      gridRow: 3,
    },
    [sizeMq('large', breakpoints)]: {
      gridRow: 2,
    },
  },
}));

/**
 * Helper component for the current match status. Used by participants and
 * spectators.
 */
const LiveMatchHeader: React.FC = () => {
  const localClasses = useLocalClasses();
  const {
    config: { bestOf },
  } = useContext(LiveMatchMetadataContext);
  const { players, games, isParticipant } = useContext(LiveMatchDataContext);

  const [player1, player2] = players;

  return (
    <>
      <PlayerScore
        // className={clsx(localClasses.score, localClasses.leftColumn)}
        className={clsx(localClasses.score, localClasses.p1Score)}
        player={player1}
      />
      <MoveIconCircle
        // className={clsx(localClasses.move, localClasses.leftColumn)}
        className={clsx(localClasses.move, localClasses.p1Move)}
        loading={!isParticipant && player1 && !player1.move}
        move={player1 && player1.move}
      />
      <Typography
        className={clsx(localClasses.centerColumn, localClasses.bestOf)}
        variant="h5"
      >
        Best of {bestOf}
      </Typography>
      <GameLog
        className={clsx(localClasses.centerColumn, localClasses.gameLog)}
        player1={player1 && player1.username}
        player2={player2 && player2.username}
        games={games}
      />
      <MoveIconCircle
        // className={clsx(localClasses.move, localClasses.rightColumn)}
        className={clsx(localClasses.move, localClasses.p2Move)}
        loading={player2 && !player2.move}
        move={player2 && player2.move}
      />
      <PlayerScore
        // className={clsx(localClasses.score, localClasses.rightColumn)}
        className={clsx(localClasses.score, localClasses.p2Score)}
        rightSide
        player={player2}
      />
    </>
  );
};

export default LiveMatchHeader;
