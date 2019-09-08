import {
  makeStyles,
  Typography,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { LiveMatchContext, LivePlayerMatch } from 'state/livematch';
import { freq } from 'util/funcs';
import { Check as IconCheck, Clear as IconClear } from '@material-ui/icons';
import FlexBox from 'components/common/FlexBox';
import useUser from 'hooks/useUser';

const useLocalStyles = makeStyles(({ spacing }) => ({
  root: {
    // Use a fixed width here so that the game log will be exactly centered
    width: 120,
  },
  rtl: {
    // Need this so we overflow to the left
    direction: 'rtl',
  },
  statusIcon: {
    margin: `0 ${spacing(0.5)}px`,
  },
}));

const ActivityIcon: React.FC<{ player: LivePlayerMatch }> = ({ player }) => {
  const localClasses = useLocalStyles();

  const [icon, text] = player.isActive
    ? [<IconCheck />, 'active'] // eslint-disable-line react/jsx-key
    : [<IconClear />, 'inactive']; // eslint-disable-line react/jsx-key
  return (
    <Tooltip
      className={localClasses.statusIcon}
      title={`${player.username} is ${text}`}
    >
      {icon}
    </Tooltip>
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
  const {
    data: { games },
  } = useContext(LiveMatchContext);
  const { user } = useUser();
  const isSelf = user && player && user.username === player.username;

  return (
    <div
      className={clsx(localClasses.root, className, {
        [localClasses.rtl]: rightSide,
      })}
    >
      {player ? (
        <>
          <FlexBox flexDirection="row">
            <Typography variant="h5" noWrap>
              {isSelf ? 'You' : player.username}
            </Typography>
            {!isSelf && <ActivityIcon player={player} />}
          </FlexBox>
          <Typography variant="h4">
            {freq(games.map(game => game.winner), player.username)}
          </Typography>
        </>
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
