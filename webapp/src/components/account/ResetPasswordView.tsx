import { TextField, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { User } from 'state/user';
import useRequest from 'hooks/useRequest';
import LoadingButton from 'components/common/LoadingButton';
import withRouteParams from 'hoc/withRouteParams';
import { validatePassword, formatValidationError } from 'util/password';
import Form from 'components/common/Form';

interface ResetApiError {
  uid?: string[];
}

const useLocalStyles = makeStyles(({ spacing, palette }) => ({
  errorText: {
    marginTop: spacing(1),
    color: palette.error.main,
  },
}));

const ResetPasswordView: React.FC<
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
    <Form
      // Send the request. Once it comes back, redirect to the home page
      onSubmit={() =>
        request({
          data: {
            uid,
            token,
            /* eslint-disable @typescript-eslint/camelcase */
            new_password1: password1,
            new_password2: password2,
            /* eslint-enable @typescript-eslint/camelcase */
          },
        }).then(() => history.push('/login'))
      }
    >
      <TextField
        id="password1"
        label="Password"
        type="password"
        value={password1}
        onChange={e => setPassword1(e.currentTarget.value)}
      />
      <TextField
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
    </Form>
  );
};

export default withRouteParams(withRouter(ResetPasswordView));
