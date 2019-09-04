import { TextField, Typography } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import useUser from 'hooks/useUser';
import { UserStateContext, User } from 'state/user';
import useRequest from 'hooks/useRequest';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import LoadingButton from 'components/common/LoadingButton';
import queryString from 'query-string';
import Form from 'components/common/Form';
import useStyles from 'hooks/useStyles';

const LoginView: React.FC<RouteComponentProps> = ({ location }) => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, requestUser } = useUser();
  const { loading: userLoading } = useContext(UserStateContext);
  const {
    state: { loading, error },
    request,
  } = useRequest<User>({ url: '/api/auth/login/', method: 'POST' });

  // User data is present now - get up on outta here
  if (user) {
    const { next } = queryString.parse(location.search);
    const fixed = Array.isArray(next) ? next[0] : next;
    return <Redirect to={fixed || ''} />;
  }

  return (
    <Form
      // Send the login request. Once it comes back, fetch user data from
      // the API
      onSubmit={() =>
        request({ data: { username, password } }).then(() => requestUser())
      }
    >
      <TextField
        id="username"
        label="Username"
        value={username}
        onChange={e => setUsername(e.currentTarget.value)}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={e => {
          setPassword(e.currentTarget.value);
        }}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        color="primary"
        loading={loading || userLoading}
        disabled={!username || !password}
      >
        Log In
      </LoadingButton>
      {error && (
        <Typography className={classes.errorMessage}>
          {error.status === 400
            ? 'Incorrect username or password'
            : "Unknown error. Looks like you're really up shit creek."}
        </Typography>
      )}
    </Form>
  );
};

export default withRouter(LoginView);
