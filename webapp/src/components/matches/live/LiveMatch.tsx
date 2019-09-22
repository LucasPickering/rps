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
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridTemplateRows: 'repeat(4, auto)',
    justifyItems: 'center',
    alignItems: 'center',
    gridRowGap: spacing(2),
  },
  subBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  status: {
    gridColumn: '1 / 7',
    gridRow: 3,
  },
  actions: {
    gridColumn: '1 / 7',
    gridRow: 4,
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
      {isParticipant ? (
        user && (
          <>
            <div className={clsx(localClasses.subBox, localClasses.status)}>
              <ParticipantMatchStatus user={user} />
            </div>
            <div className={clsx(localClasses.subBox, localClasses.actions)}>
              <ParticipantActions user={user} />
            </div>
          </>
        )
      ) : (
        <>
          <SpectatorMatchStatus />
          <SpectatorActions />
        </>
      )}
    </div>
  );
};

export default LiveMatch;
