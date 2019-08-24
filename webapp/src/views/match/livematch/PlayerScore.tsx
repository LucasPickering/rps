import { makeStyles, Typography, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { LiveMatchContext, LiveMatchOpponent } from 'state/livematch';
import { GameOutcome } from 'state/match';
import { countGameOutcomes } from 'util/funcs';
import { Check as IconCheck, Clear as IconClear } from '@material-ui/icons';
import FlexBox from 'components/core/FlexBox';

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

const ActivityIcon: React.FC<{ opponent?: LiveMatchOpponent }> = ({
  opponent,
}) => {
  const localClasses = useLocalStyles();
  if (opponent) {
    const [icon, text] = opponent.isActive
      ? [<IconCheck />, 'active'] // eslint-disable-line react/jsx-key
      : [<IconClear />, 'inactive']; // eslint-disable-line react/jsx-key
    return (
      <Tooltip
        className={localClasses.statusIcon}
        title={`${opponent.username} is ${text}`}
      >
        {icon}
      </Tooltip>
    );
  }
  return null;
};

interface Props {
  className?: string;
  isSelf: boolean;
}

// We have to leave the React.FC tag off to get default props to work
const PlayerScore: React.FC<Props> & { defaultProps: Partial<Props> } = ({
  className,
  isSelf,
}) => {
  const localClasses = useLocalStyles();
  const {
    state: {
      data: { games, opponent },
    },
  } = useContext(LiveMatchContext);

  const num = countGameOutcomes(
    games,
    isSelf ? GameOutcome.Win : GameOutcome.Loss
  );
  const name = isSelf ? 'You' : opponent ? opponent.username : 'No Opponent';

  return (
    <div
      className={clsx(localClasses.root, className, {
        [localClasses.rtl]: !isSelf,
      })}
    >
      <FlexBox flexDirection="row">
        <Typography variant="h5" noWrap>
          {name}
        </Typography>
        {!isSelf && <ActivityIcon opponent={opponent} />}
      </FlexBox>
      <Typography variant="h4">{num}</Typography>
    </div>
  );
};

PlayerScore.defaultProps = {
  isSelf: false,
};

export default PlayerScore;
