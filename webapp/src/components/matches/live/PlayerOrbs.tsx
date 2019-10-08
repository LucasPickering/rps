import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext } from 'react';
import {
  LiveMatchDataContext,
  LiveMatchMetadataContext,
} from 'state/livematch';
import { freq } from 'util/funcs';
import FlexBox from 'components/common/FlexBox';
import { range } from 'lodash';

const useLocalStyles = makeStyles(({ palette, spacing }) => ({
  orb: {
    width: 16,
    height: 16,
    borderRadius: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: palette.secondary.dark,
    margin: spacing(0.5),
    transition: 'background-color 0.2s linear',
  },
  filledOrb: {
    backgroundColor: palette.secondary.main,
  },
}));

// We have to leave the React.FC tag off to get default props to work
const PlayerOrbs: React.FC<{
  className?: string;
  playerName?: string;
}> = ({ className, playerName }) => {
  const localClasses = useLocalStyles();
  const {
    config: { bestOf },
  } = useContext(LiveMatchMetadataContext);
  const { games } = useContext(LiveMatchDataContext);

  if (playerName) {
    const gamesToWin = Math.ceil(bestOf / 2);
    const gamesWon = freq(games.map(game => game.winner), playerName);

    return (
      <FlexBox className={className} flexDirection="column">
        {range(gamesToWin).map(i => (
          <div
            key={i}
            className={clsx(localClasses.orb, {
              [localClasses.filledOrb]: i < gamesWon,
            })}
          />
        ))}
      </FlexBox>
    );
  }

  return null;
};

export default PlayerOrbs;
