import React from 'react';
import withRouteParams from 'hoc/withRouteParams';
import LiveMatchView from './LiveMatchHandler';
import NewLiveMatchHandler from './NewLiveMatchHandler';
import useUser from 'hooks/useUser';
import { Typography, Grid } from '@material-ui/core';
import LogInButton from 'components/login/LogInButton';

/**
 * Handles all /match/live/* routes. If the guid is "new", this will render a
 * component that fetches a new guid from the API then redirects to the match
 * page with that guid.
 */
const LiveMatchContainer: React.FC<{
  matchId: string;
}> = ({ matchId }) => {
  // Only show the live match page if the user is logged in
  const user = useUser();
  if (user) {
    if (matchId === 'new') {
      return <NewLiveMatchHandler />;
    }

    return <LiveMatchView matchId={matchId} />;
  }

  // Otherwise, show a simple message
  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h5">
          You must be logged in to play a match.
        </Typography>
      </Grid>
      <Grid item>
        <LogInButton variant="contained" />
      </Grid>
    </Grid>
  );
};

export default withRouteParams(LiveMatchContainer);
