import { TextField, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { User } from 'state/user';
import FlexBox from 'components/core/FlexBox';
import useRequest from 'hooks/useRequest';
import LoadingButton from 'components/core/LoadingButton';
import withRouteParams from 'hoc/withRouteParams';

interface ResetApiError {
  uid?: string[];
}

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
  console.log('error', error);

  return (
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
        }).then(() => history.push(''));
        event.preventDefault(); // Don't reload the page
      }}
    >
      <FlexBox flexDirection="column">
        <TextField
          className={localClasses.textField}
          id="password"
          label="Password"
          type="password"
          value={password1}
          onChange={e => {
            setPassword1(e.currentTarget.value);
          }}
        />
        <TextField
          className={localClasses.textField}
          id="confirm-password"
          label="Confirm Password"
          type="password"
          value={password2}
          onChange={e => {
            setPassword2(e.currentTarget.value);
          }}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          disabled={!password1 || password1 !== password2}
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
  );
};

export default withRouteParams(withRouter(ResetPassword1View));
