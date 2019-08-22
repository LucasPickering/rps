import { Typography } from '@material-ui/core';
import React from 'react';
import useSplashMessage, { notFoundSplasher } from 'hooks/useSplashMessage';

const NotFound: React.FC = () => {
  const message = useSplashMessage(notFoundSplasher, '');
  return <Typography variant="h3">{message}</Typography>;
};

export default NotFound;
