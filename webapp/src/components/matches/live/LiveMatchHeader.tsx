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

const useLocalStyles = makeStyles(() => ({
  p1Score: {
    justifySelf: 'start',
    gridColumn: 1,
    gridRow: 1,
  },
  p1Move: {
    gridColumn: 2,
    gridRow: 1,
  },
  bestOf: {
    gridColumn: '3 / 5',
    gridRow: 1,
  },
  gameLog: {
    gridColumn: '3 / 5',
    gridRow: 2,
  },
  p2Move: {
    gridColumn: 5,
    gridRow: 1,
  },
  p2Score: {
    justifySelf: 'end',
    gridColumn: 6,
    gridRow: 1,
  },
}));

/**
 * Helper component for the current match status. Used by participants and
 * spectators.
 */
const LiveMatchHeader: React.FC = () => {
  const localClasses = useLocalStyles();
  const {
    config: { bestOf },
  } = useContext(LiveMatchMetadataContext);
  const { players, games, isParticipant } = useContext(LiveMatchDataContext);

  const [player1, player2] = players;

  // Responsive design!
  return (
    <>
      <PlayerScore className={clsx(localClasses.p1Score)} player={player1} />
      <MoveIconCircle
        className={localClasses.p1Move}
        loading={!isParticipant && player1 && !player1.move}
        move={player1 && player1.move}
      />
      <Typography className={localClasses.bestOf} variant="h5">
        Best of {bestOf}
      </Typography>
      <GameLog
        className={localClasses.gameLog}
        player1={player1 && player1.username}
        player2={player2 && player2.username}
        games={games}
      />
      <MoveIconCircle
        className={localClasses.p2Move}
        loading={player2 && !player2.move}
        move={player2 && player2.move}
      />
      <PlayerScore
        className={localClasses.p2Score}
        rightSide
        player={player2}
      />
    </>
  );
};

export default LiveMatchHeader;
