import { makeStyles } from '@material-ui/core';
import React from 'react';
import MoveIcon from 'components/MoveIcon';
import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from '@material-ui/icons';
import clsx from 'clsx';
import { Game } from 'state/match';

const useLocalStyles = makeStyles(({ spacing }) => ({
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
  className?: string;
  size: 'small' | 'large';
  player1: string;
  player2: string;
  games: Game[];
}

const GameLog = ({
  className,
  size,
  player1,
  player2,
  games,
}: Props): React.ReactElement => {
  const localClasses = useLocalStyles();

  return (
    <div className={className}>
      {games.map(game => {
        const player1Win = game.winner === player1;
        const player2Win = game.winner === player2;
        const [player1Game, player2Game] = game.players;

        return (
          <div
            key={game.gameNum}
            className={clsx(localClasses.game, localClasses[size], {
              [localClasses.tie]: !game.winner,
            })}
          >
            {player1Win && (
              <IconChevronLeft className={localClasses.player1Win} />
            )}
            <MoveIcon
              className={localClasses.player1MoveIcon}
              move={player1Game.move}
            />
            <span className={localClasses.centerIcon}>{game.gameNum + 1}</span>
            <MoveIcon move={player2Game.move} />
            {player2Win && <IconChevronRight />}
          </div>
        );
      })}
    </div>
  );
};

GameLog.defaultProps = {
  size: 'small',
};

export default GameLog;
