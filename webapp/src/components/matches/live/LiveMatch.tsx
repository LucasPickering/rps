import { Grid, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { LiveMatchDataContext } from 'state/livematch';
import useUser from 'hooks/useUser';
import LiveMatchHeader from './LiveMatchHeader';
import ParticipantActions from './ParticipantActions';
import SpectatorActions from './SpectatorActions';

const useLocalStyles = makeStyles(({ spacing }) => ({
  bottomSection: { paddingTop: spacing(1) },
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
    <>
      <LiveMatchHeader />
      <Grid
        className={localClasses.bottomSection}
        container
        direction="column"
        alignItems="center"
      >
        {/* If participating, user should ALWAYS be defined */}
        {isParticipant ? (
          user && <ParticipantActions user={user} />
        ) : (
          <SpectatorActions />
        )}
      </Grid>
    </>
  );
};

export default LiveMatch;
