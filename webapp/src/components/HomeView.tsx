import React from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import useStyles from 'hooks/useStyles';
import useSplashMessage, { welcomeSplashes } from 'hooks/useSplashMessage';
import Leaderboard from './players/Leaderboard';
import RecentMatches from './matches/RecentMatches';
import PageLayout from './common/PageLayout';
// import OngoingMatches from './players/OngoingMatches';

const useLocalStyles = makeStyles(({ spacing }) => ({
  titleBox: {
    alignSelf: 'center',
    paddingBottom: spacing(2),
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const localClasses = useLocalStyles();
  const welcome = useSplashMessage(welcomeSplashes);

  return (
    <PageLayout maxWidth="md">
      <div className={localClasses.titleBox}>
        <Typography className={classes.pageTitle}>
          Rock Paper Scissors
        </Typography>
        <Typography className={classes.caption}>{welcome}</Typography>
      </div>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <RecentMatches />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Leaderboard />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <OngoingMatches />
        </Grid> */}
      </Grid>
    </PageLayout>
  );
};

export default Home;
