import { Grid, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { LiveMatchContext } from 'state/livematch';
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
  const {
    data: { player1, isParticipant },
  } = useContext(LiveMatchContext);
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
        {/* If participating, user/player1 should ALWAYS be defined */}
        {isParticipant ? (
          user &&
          player1 && <ParticipantActions user={user} player1={player1} />
        ) : (
          <SpectatorActions />
        )}
      </Grid>
    </>
  );
};

export default LiveMatch;
