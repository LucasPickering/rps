import React from 'react';
import { Grid } from '@material-ui/core';
import useSplashMessage, { welcomeSplashes } from 'hooks/useSplashMessage';
import Leaderboard from './players/Leaderboard';
import RecentMatches from './matches/RecentMatches';
import PageLayout from './common/PageLayout';
// import OngoingMatches from './players/OngoingMatches';

const Home: React.FC = () => {
  const welcome = useSplashMessage(welcomeSplashes);

  return (
    <PageLayout maxWidth="md" title="Rock Paper Scissors" subtitle={welcome}>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Leaderboard />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RecentMatches />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <OngoingMatches />
        </Grid> */}
      </Grid>
    </PageLayout>
  );
};

export default Home;
