import { Button, TextField, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import useUser from 'hooks/useUser';
import React, { useContext, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { UserActionType, UserDispatchContext } from 'state/user';
import routes from 'util/routes';
import queryString from 'query-string';
import FlexBox from 'components/core/FlexBox';

const useLocalStyles = makeStyles(({ spacing, palette }) => ({
  logInButton: {
    marginTop: spacing(1),
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
  const [error, setError] = useState();
  const user = useUser();
  const userDispatch = useContext(UserDispatchContext);

  // Already logged in - get up on outta here
  if (user) {
    const { next } = queryString.parse(location.search);
    const fixed = Array.isArray(next) ? next[0] : next;
    return <Redirect to={fixed || routes.home.build({}, {})} />;
  }

  return (
    <form
      onSubmit={event => {
        axios
          .post('/api/login', {
            username,
            password,
          })
          .then(response => {
            userDispatch({
              type: UserActionType.Login,
              user: response.data,
            });
          })
          .catch(err => {
            setError(err);
          });
        setError(undefined);

        event.preventDefault(); // Don't reload the page
      }}
    >
      <FlexBox flexDirection="column">
        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={e => {
            setUsername(e.currentTarget.value);
          }}
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
        <Button
          className={localClasses.logInButton}
          type="submit"
          variant="contained"
          color="primary"
          disabled={!username || !password}
        >
          Log In
        </Button>
        {error && (
          <Typography className={localClasses.errorText}>
            {error.response.status === 401
              ? 'Incorrect username or password'
              : "Unknown error. Looks like you're really up shit creek."}
          </Typography>
        )}
      </FlexBox>
    </form>
  );
};

export default withRouter(LoginForm);
