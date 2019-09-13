import { Typography } from '@material-ui/core';
import React from 'react';
import useSplashMessage, { notFoundSplasher } from 'hooks/useSplashMessage';
import useStyles from 'hooks/useStyles';
import PageLayout from './common/PageLayout';

const NotFoundView: React.FC = () => {
  const classes = useStyles();
  const message = useSplashMessage(notFoundSplasher);
  return (
    <PageLayout>
      <Typography className={classes.majorMessage}>Not Found</Typography>
      <Typography className={classes.normalMessage}>{message}</Typography>
    </PageLayout>
  );
};

export default NotFoundView;
