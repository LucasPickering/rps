import {
  makeStyles,
  Typography,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import clsx from 'clsx';
import { range } from 'lodash';
import React, { useContext } from 'react';
import {
  LiveMatchMetadataContext,
  LiveMatchDataContext,
  LivePlayerMatch,
} from 'state/livematch';
import { freq, gamesToWin } from 'util/funcs';
import { sizeMq } from 'util/styles';
import { Check as IconCheck, Clear as IconClear } from '@material-ui/icons';
import FlexBox from 'components/common/FlexBox';
import useUser from 'hooks/useUser';

const useLocalStyles = makeStyles(
  ({ breakpoints, palette, spacing, transitions }) => ({
    playerScore: { width: '100%' },
    leftSide: {
      textAlign: 'left',
    },
    rightSide: {
      textAlign: 'right',
    },
    statusIcon: {
      margin: `0 ${spacing(0.5)}px`,
    },
    self: {
      color: palette.secondary.main,
      '& $orb': {
        borderColor: palette.secondary.main,
      },
      '& $filledOrb': {
        backgroundColor: palette.secondary.main,
      },
    },
    orb: {
      borderRadius: '100%',
      borderWidth: 1,
      borderStyle: 'solid',
      transition: `background-color ${transitions.duration.short}ms linear`,
      margin: spacing(0.25),
      borderColor: palette.text.primary,

      [sizeMq('small', breakpoints)]: {
        width: 8,
        height: 8,
      },
      [sizeMq('large', breakpoints)]: {
        width: 12,
        height: 12,
      },
    },
    filledOrb: {
      backgroundColor: palette.text.primary,
    },
  })
);

const PopulatedPlayerScore: React.FC<{
  isSelf: boolean;
  rightSide: boolean;
  player: LivePlayerMatch;
}> = ({ isSelf, rightSide, player }) => {
  const localClasses = useLocalStyles();
  const {
    config: { bestOf },
  } = useContext(LiveMatchMetadataContext);
  const { games } = useContext(LiveMatchDataContext);

  const [icon, text] = player.isActive
    ? [<IconCheck />, 'active'] // eslint-disable-line react/jsx-key
    : [<IconClear />, 'inactive']; // eslint-disable-line react/jsx-key
  const orbCount = gamesToWin(bestOf);
  const gamesWon = freq(games.map(game => game.winner), player.username);

  return (
    <>
      <FlexBox flexDirection={rightSide ? 'row-reverse' : 'row'}>
        <Typography variant="h5" noWrap>
          {isSelf ? 'You' : player.username}
        </Typography>
        {!isSelf && (
          <Tooltip
            className={localClasses.statusIcon}
            title={`${player.username} is ${text}`}
          >
            {icon}
          </Tooltip>
        )}
      </FlexBox>
      <Typography variant="h4">
        {freq(games.map(game => game.winner), player.username)}
      </Typography>
      <FlexBox flexDirection={rightSide ? 'row-reverse' : 'row'}>
        {range(orbCount).map(i => (
          <div
            key={i}
            className={clsx(localClasses.orb, {
              [localClasses.filledOrb]: i < gamesWon,
            })}
          />
        ))}
      </FlexBox>
    </>
  );
};

interface Props {
  className?: string;
  player?: LivePlayerMatch;
  rightSide: boolean;
}

// We have to leave the React.FC tag off to get default props to work
const PlayerScore = ({
  className,
  player,
  rightSide,
}: Props): React.ReactElement => {
  const localClasses = useLocalStyles();
  const { user } = useUser();
  const isSelf = Boolean(user && player && user.username === player.username);

  return (
    <div
      className={clsx(
        localClasses.playerScore,
        rightSide ? localClasses.rightSide : localClasses.leftSide,
        { [localClasses.self]: isSelf },
        className
      )}
    >
      {player ? (
        <PopulatedPlayerScore
          player={player}
          isSelf={isSelf}
          rightSide={rightSide}
        />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

PlayerScore.defaultProps = {
  rightSide: false,
};

export default PlayerScore;
