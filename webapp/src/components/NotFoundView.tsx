import { Typography } from '@material-ui/core';
import React from 'react';
import useSplashMessage, { notFoundSplashes } from 'hooks/useSplashMessage';
import useStyles from 'hooks/useStyles';
import PageLayout from './common/PageLayout';

const NotFoundView: React.FC = () => {
  const classes = useStyles();
  const message = useSplashMessage(notFoundSplashes);
  return (
    <PageLayout>
      <Typography className={classes.majorMessage}>Not Found</Typography>
      <Typography className={classes.normalMessage}>{message}</Typography>
    </PageLayout>
  );
};

export default NotFoundView;
