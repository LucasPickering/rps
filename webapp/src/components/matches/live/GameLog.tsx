import { makeStyles } from '@material-ui/core';
import React from 'react';
import { SpectatorLiveGame } from 'state/livematch';
import MoveIcon from 'components/MoveIcon';
import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from '@material-ui/icons';
import clsx from 'clsx';

const useLocalStyles = makeStyles(({ palette, spacing }) => ({
  game: {
    display: 'grid',
    alignItems: 'center',
  },
  small: {
    fontSize: 14,
    gridTemplateColumns: '24px 14px 32px 14px 24px',
  },
  large: {
    fontSize: 24,
    gridTemplateColumns: '1fr 1fr 3fr 1fr 1fr',
    gridRowGap: spacing(0.5),
    gridColumnGap: spacing(1),
  },
  tie: {
    opacity: 0.6,
  },
  win: {
    color: 'green',
  },
  loss: {
    color: palette.error.main,
  },
  player1Win: {
    gridColumn: 1,
  },
  player1MoveIcon: {
    gridColumn: 2,
  },
  centerIcon: {
    gridColumn: 3,
    textAlign: 'center',
  },
}));

interface Props {
  size: 'small' | 'large';
  highlight: boolean;
  player1: string;
  player2: string;
  games: SpectatorLiveGame[];
}

const GameLog = ({
  size,
  highlight,
  player1,
  player2,
  games,
}: Props): React.ReactElement => {
  const localClasses = useLocalStyles();

  return (
    <div>
      {games.map((game, i) => {
        const player1Win = game.winner === player1;
        const player2Win = game.winner === player2;
        return (
          <div
            key={i}
            className={clsx(localClasses.game, localClasses[size], {
              [localClasses.tie]: !game.winner,
              [localClasses.win]: highlight && player1Win,
              [localClasses.loss]: highlight && player2Win,
            })}
          >
            {player1Win && (
              <IconChevronLeft className={localClasses.player1Win} />
            )}
            <MoveIcon
              className={localClasses.player1MoveIcon}
              move={game.player1Move}
            />
            <span className={localClasses.centerIcon}>{i + 1}</span>
            <MoveIcon move={game.player2Move} />
            {player2Win && <IconChevronRight />}
          </div>
        );
      })}
    </div>
  );
};

GameLog.defaultProps = {
  size: 'small',
  highlight: false,
};

export default GameLog;
