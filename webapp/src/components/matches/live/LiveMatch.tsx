import { makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { LiveMatchDataContext } from 'state/livematch';
import useUser from 'hooks/useUser';
import LiveMatchHeader from './LiveMatchHeader';
import ParticipantActions from './ParticipantActions';
import SpectatorActions from './SpectatorActions';
import ParticipantMatchStatus from './ParticipantMatchStatus';
import SpectatorMatchStatus from './SpectatorMatchStatus';
import clsx from 'clsx';
import { sizeMq } from 'util/styles';

const useLocalStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    height: '100%',
    display: 'grid',
    justifyItems: 'center',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridTemplateRows: 'repeat(4, auto) 1fr',
    gridRowGap: spacing(2),
  },
  subBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  status: {
    [sizeMq('small', breakpoints)]: {
      gridColumn: '1 / span 6',
      gridRow: 4,
    },
    [sizeMq('large', breakpoints)]: {
      gridColumn: '2 / span 4',
      gridRow: '3 / span 2',
    },
  },
  actions: {
    gridColumn: '1 / span 6',
    gridRow: 5,
    [sizeMq('small', breakpoints)]: {
      alignSelf: 'end',
    },
  },
}));

/**
 * Display and actions for an in-progress match. This is used for participants
 * and spectators.
 */
const LiveMatch: React.FC = () => {
  const localClasses = useLocalStyles();
  const { isParticipant } = useContext(LiveMatchDataContext);
  const { user } = useUser();

  return (
    <div className={localClasses.root}>
      <LiveMatchHeader />
      {/* If participating, user should ALWAYS be defined */}

      <div className={clsx(localClasses.subBox, localClasses.status)}>
        {isParticipant ? (
          user && <ParticipantMatchStatus user={user} />
        ) : (
          <SpectatorMatchStatus />
        )}
      </div>
      <div className={clsx(localClasses.subBox, localClasses.actions)}>
        {isParticipant ? (
          user && <ParticipantActions user={user} />
        ) : (
          <SpectatorActions />
        )}
      </div>
    </div>
  );
};

export default LiveMatch;
