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
    textAlign: 'center',
    display: 'grid',
    justifyItems: 'center',
    // 12 for both, to allow room to grow
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridTemplateRows: 'repeat(11, auto) 1fr',
  },
  subBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  status: {
    [sizeMq('small', breakpoints)]: {
      gridColumn: '2 / span 10',
      gridRow: 11,
    },
    [sizeMq('large', breakpoints)]: {
      gridColumn: '3 / span 8',
      gridRow: 11,
    },
  },
  actions: {
    marginTop: spacing(2),
    gridColumn: '2 / span 10',
    gridRow: 12,
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
