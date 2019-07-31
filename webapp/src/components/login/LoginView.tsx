import { makeStyles, Theme } from '@material-ui/core';
import Paper from 'components/mui/Paper';
import React from 'react';
import LoginForm from './LoginForm';

const useLocalStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    width: 300,
    alignSelf: 'center',
  },
}));

const LoginView: React.FC = () => {
  const localClasses = useLocalStyles();
  return (
    <Paper className={localClasses.root}>
      <LoginForm />
    </Paper>
  );
};

export default LoginView;
