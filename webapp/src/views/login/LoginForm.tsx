import { TextField, makeStyles, Typography } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { User, UserStateContext } from 'state/user';
import queryString from 'query-string';
import FlexBox from 'components/core/FlexBox';
import useRequest from 'hooks/useRequest';
import LoadingButton from 'components/core/LoadingButton';
import useUser from 'hooks/useUser';

const useLocalStyles = makeStyles(({ spacing, palette }) => ({
  textField: {
    width: '100%',
    marginBottom: spacing(1),
  },
  errorText: {
    marginTop: spacing(1),
    color: palette.error.main,
  },
}));

const LoginForm: React.FC<RouteComponentProps> = ({ location }) => {
  const localClasses = useLocalStyles();
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
    <form
      onSubmit={event => {
        // Send the login request. Once it comes back, fetch user data from
        // the API
        request({ data: { username, password } }).then(() => requestUser());
        event.preventDefault(); // Don't reload the page
      }}
    >
      <FlexBox flexDirection="column">
        <TextField
          className={localClasses.textField}
          id="username"
          label="Username"
          value={username}
          onChange={e => {
            setUsername(e.currentTarget.value);
          }}
        />
        <TextField
          className={localClasses.textField}
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
          <Typography className={localClasses.errorText}>
            {error.status === 401
              ? 'Incorrect username or password'
              : "Unknown error. Looks like you're really up shit creek."}
          </Typography>
        )}
      </FlexBox>
    </form>
  );
};

export default withRouter(LoginForm);
