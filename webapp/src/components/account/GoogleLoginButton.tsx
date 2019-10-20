import React from 'react';
import queryString from 'query-string';
import { GoogleLogo } from 'components/common/icons';
import { Button } from '@material-ui/core';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLoginButton = ({
  connect,
}: {
  connect: boolean;
}): React.ReactElement => {
  const redirectRoute = connect
    ? '/account/connect/redirect/google'
    : '/account/login/redirect/google';
  const query = queryString.stringify({
    /* eslint-disable @typescript-eslint/camelcase */
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${window.origin}${redirectRoute}`,
    prompt: 'select_account',
    scope: 'profile email',
    /* eslint-enable */
  });

  return (
    <Button
      startIcon={<GoogleLogo />}
      variant="contained"
      href={`https://accounts.google.com/o/oauth2/v2/auth?${query}`}
    >
      {connect ? 'Connect to Google' : 'Sign in with Google'}
    </Button>
  );
};

GoogleLoginButton.defaultProps = {
  connect: false,
};

export default GoogleLoginButton;
