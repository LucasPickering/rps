import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import useStyles from 'hooks/useStyles';
import useSplashMessage, { welcomeSplasher } from 'hooks/useSplashMessage';
import Leaderboard from './leaderboard/Leaderboard';

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
      <Grid item>
        <Leaderboard />
      </Grid>
    </>
  );
};

export default Home;
