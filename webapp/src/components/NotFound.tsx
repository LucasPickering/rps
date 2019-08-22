import { Typography, Grid } from '@material-ui/core';
import React from 'react';
import useSplashMessage, { notFoundSplasher } from 'hooks/useSplashMessage';
import useStyles from 'hooks/useStyles';

const NotFound: React.FC = () => {
  const classes = useStyles();
  const message = useSplashMessage(notFoundSplasher, '');
  return (
    <>
      <Grid item>
        <Typography className={classes.majorMessage}>Not Found</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.normalMessage}>{message}</Typography>
      </Grid>
    </>
  );
};

export default NotFound;
