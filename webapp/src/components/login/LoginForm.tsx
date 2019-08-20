import { TextField, makeStyles, Typography } from '@material-ui/core';
import useUser from 'hooks/useUser';
import React, { useContext, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { UserActionType, UserDispatchContext, User } from 'state/user';
import routes from 'util/routes';
import queryString from 'query-string';
import FlexBox from 'components/core/FlexBox';
import useRequest from 'hooks/useRequest';
import LoadingButton from 'components/core/LoadingButton';

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
  const user = useUser();
  const userDispatch = useContext(UserDispatchContext);
  const {
    state: { loading, error },
    request,
  } = useRequest<User>({ url: '/api/login', method: 'POST' });

  // Already logged in - get up on outta here
  if (user) {
    const { next } = queryString.parse(location.search);
    const fixed = Array.isArray(next) ? next[0] : next;
    return <Redirect to={fixed || routes.home.build({}, {})} />;
  }

  return (
    <form
      onSubmit={event => {
        request({ data: { username, password } }).then(data =>
          userDispatch({
            type: UserActionType.Login,
            user: data,
          })
        );
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
          loading={loading}
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
