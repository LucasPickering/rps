import { TextField, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { User } from 'state/user';
import FlexBox from 'components/core/FlexBox';
import useRequest from 'hooks/useRequest';
import LoadingButton from 'components/core/LoadingButton';
import withRouteParams from 'hoc/withRouteParams';
import { validatePassword, formatValidationError } from 'util/password';
import Paper from 'components/core/Paper';

interface ResetApiError {
  uid?: string[];
}

const useLocalStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    width: 300,
  },
  textField: {
    width: '100%',
    marginBottom: spacing(1),
  },
  errorText: {
    marginTop: spacing(1),
    color: palette.error.main,
  },
}));

const ResetPassword1View: React.FC<
  RouteComponentProps & { uid: string; token: string }
> = ({ history, uid, token }) => {
  const localClasses = useLocalStyles();
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const {
    state: { loading, error },
    request,
  } = useRequest<User, ResetApiError>({
    url: '/api/auth/password/reset/confirm/',
    method: 'POST',
  });

  const validationError =
    password1 || password2 ? validatePassword(password1, password2) : undefined;

  return (
    <Paper className={localClasses.root}>
      <form
        onSubmit={event => {
          // Send the request. Once it comes back, redirect to the home page
          request({
            data: {
              uid,
              token,
              /* eslint-disable @typescript-eslint/camelcase */
              new_password1: password1,
              new_password2: password2,
              /* eslint-enable @typescript-eslint/camelcase */
            },
          }).then(() => history.push('/login'));
          event.preventDefault(); // Don't reload the page
        }}
      >
        <FlexBox flexDirection="column">
          <TextField
            className={localClasses.textField}
            id="password1"
            label="Password"
            type="password"
            value={password1}
            onChange={e => setPassword1(e.currentTarget.value)}
          />
          <TextField
            className={localClasses.textField}
            id="password2"
            label="Confirm Password"
            type="password"
            value={password2}
            error={validationError !== undefined}
            helperText={
              validationError !== undefined &&
              formatValidationError(validationError)
            }
            onChange={e => setPassword2(e.currentTarget.value)}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={loading}
            disabled={!password1 || Boolean(validationError)}
          >
            Reset Password
          </LoadingButton>
          {error && (
            <Typography className={localClasses.errorText}>
              {error.data.uid}
            </Typography>
          )}
        </FlexBox>
      </form>
    </Paper>
  );
};

export default withRouteParams(withRouter(ResetPassword1View));
