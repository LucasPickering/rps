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

// Different classes based on screen size - responsive design!
const useLocalClasses = makeStyles(({ breakpoints, spacing }) => ({
  // Scores
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
      gridColumn: '1 / span 6',
    },
    [sizeMq('large', breakpoints)]: {
      gridColumn: '1 / span 4',
    },
  },
  p2Score: {
    justifySelf: 'end',
    [sizeMq('small', breakpoints)]: {
      gridColumn: '7 / span 6',
    },
    [sizeMq('large', breakpoints)]: {
      gridColumn: '9 / span 4',
    },
  },

  // Moves
  move: {
    [sizeMq('small', breakpoints)]: {
      margin: `${spacing(1)}px 0`,
      gridRow: '2 / span 2',
    },
    [sizeMq('large', breakpoints)]: {
      margin: `${spacing(2)}px 0`,
      gridRow: 3,
    },
  },
  p1Move: {
    justifySelf: 'start',
    gridColumn: '1 / span 3',
  },
  p2Move: {
    justifySelf: 'end',
    gridColumn: '10 / span 3',
  },

  // Orbs
  orbs: {
    gridRow: '4 / span 9',
  },
  p1Orbs: {
    justifySelf: 'start',
    gridColumn: 1,
  },
  p2Orbs: {
    justifySelf: 'end',
    gridColumn: 12,
  },

  // Neutral/center components
  centerColumn: {
    gridColumn: '4 / span 6',
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
      gridRow: '3 / span 7',
    },
    [sizeMq('large', breakpoints)]: {
      gridRow: '2 / span 8',
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
      {/* Player 1 components */}
      <PlayerScore
        className={clsx(localClasses.score, localClasses.p1Score)}
        player={player1}
      />
      <MoveIconCircle
        className={clsx(localClasses.move, localClasses.p1Move)}
        loading={!isParticipant && player1 && !player1.move}
        move={player1 && player1.move}
      />

      {/* Neutral components */}
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

      {/* Player 2 components */}
      <PlayerScore
        className={clsx(localClasses.score, localClasses.p2Score)}
        rightSide
        player={player2}
      />
      <MoveIconCircle
        className={clsx(localClasses.move, localClasses.p2Move)}
        loading={player2 && !player2.move}
        move={player2 && player2.move}
      />
    </>
  );
};

export default LiveMatchHeader;
