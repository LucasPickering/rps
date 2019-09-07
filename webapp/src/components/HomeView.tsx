import React from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import useStyles from 'hooks/useStyles';
import useSplashMessage, { welcomeSplasher } from 'hooks/useSplashMessage';
import Leaderboard from './players/Leaderboard';
import RecentMatches from './matches/RecentMatches';
import PageLayout from './common/PageLayout';

const useLocalStyles = makeStyles(() => ({
  titleBox: {
    alignSelf: 'center',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const localClasses = useLocalStyles();
  const welcome = useSplashMessage(welcomeSplasher, '');

  return (
    <PageLayout maxWidth="md">
      <div className={localClasses.titleBox}>
        <Typography className={classes.majorMessage}>
          Rock Paper Scissors
        </Typography>
        <Typography className={classes.minorMessage}>{welcome}</Typography>
      </div>
      <Grid container justify="center" spacing={2}>
        <Grid
          item
          xs={12}
          container
          direction="column"
          alignItems="center"
        ></Grid>
        <Grid item>
          <RecentMatches />
        </Grid>
        <Grid item>
          <Leaderboard />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default Home;
