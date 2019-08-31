import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import useStyles from 'hooks/useStyles';
import useSplashMessage, { welcomeSplasher } from 'hooks/useSplashMessage';
import Leaderboard from './leaderboard/Leaderboard';
import RecentMatches from './match/RecentMatches';

const Home: React.FC = () => {
  const classes = useStyles();
  const welcome = useSplashMessage(welcomeSplasher, '');
  return (
    <>
      <Grid item>
        <Typography className={classes.majorMessage}>
          Rock Paper Scissors (Lizard Spock)
        </Typography>
        <Typography className={classes.minorMessage}>{welcome}</Typography>
      </Grid>
      <Grid item container spacing={2} justify="center">
        <Grid item>
          <RecentMatches />
        </Grid>
        <Grid item>
          <Leaderboard />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
