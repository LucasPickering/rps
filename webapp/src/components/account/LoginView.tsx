import { makeStyles } from '@material-ui/core';
import Paper from 'components/common/Paper';
import React from 'react';
import LoginForm from './LoginForm';

const useLocalStyles = makeStyles(() => ({
  root: {
    width: 300,
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
