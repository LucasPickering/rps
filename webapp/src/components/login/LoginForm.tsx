import { Box, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import useUser from 'hooks/useUser';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router';
import { UserActionType, UserDispatchContext } from 'state/user';
import routes from 'util/routes';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const user = useUser();
  const userDispatch = useContext(UserDispatchContext);

  // Already logged in - get up on outta here
  if (user) {
    return <Redirect to={routes.home.build({})} />;
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
      <Box display="flex" flexDirection="column">
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
          type="submit"
          variant="contained"
          color="primary"
          disabled={!username || !password}
        >
          Log In
        </Button>
        {error && <p>{JSON.stringify(error)}</p>}
      </Box>
    </form>
  );
};

export default LoginForm;
