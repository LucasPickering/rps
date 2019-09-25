import { TextField, Typography } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import useUser from 'hooks/useUser';
import { UserStateContext } from 'state/user';
import useRequest from 'hooks/useRequest';
import LoadingButton from 'components/common/LoadingButton';
import Form from 'components/common/Form';
import useStyles from 'hooks/useStyles';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';

interface LoginFormData {
  username: string;
  password: string;
}

const PasswordLoginForm: React.FC = ({ children }) => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { requestUser } = useUser();
  const { loading: userLoading } = useContext(UserStateContext);
  const {
    state: { loading, error },
    request,
  } = useRequest<{}, {}, undefined, LoginFormData>({
    url: '/api/auth/login/',
    method: 'POST',
  });

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
        onChange={e => setPassword(e.currentTarget.value)}
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
      {error && error.status === 400 ? (
        <Typography className={classes.errorMessage}>
          Incorrect username or password
        </Typography>
      ) : (
        <ApiErrorDisplay error={error} />
      )}
      {children}
    </Form>
  );
};

export default PasswordLoginForm;
