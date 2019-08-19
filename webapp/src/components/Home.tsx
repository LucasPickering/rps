import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import useSplashMessage, { welcomeSplasher } from 'hooks/useSplashMessage';

const useLocalStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
  },
}));

interface Props {
  matchId: string;
}

const Home: React.FC<Props> = () => {
  const localClasses = useLocalStyles();
  const welcome = useSplashMessage(welcomeSplasher, '');
  return (
    <div className={localClasses.root}>
      <Typography variant="h3">Rock Paper Scissors (Lizard Spock)</Typography>
      <Typography variant="h5">{welcome}</Typography>
    </div>
  );
};

export default Home;
