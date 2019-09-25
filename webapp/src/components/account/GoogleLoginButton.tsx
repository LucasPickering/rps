import React from 'react';
import { getEnv } from 'util/funcs';
import queryString from 'query-string';
import { GoogleLogo } from 'components/common/icons';
import { Button } from '@material-ui/core';

const CLIENT_ID = getEnv('REACT_APP_GOOGLE_CLIENT_ID');

const GoogleLoginButton: React.FC = () => {
  /* eslint-disable @typescript-eslint/camelcase */
  const query = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: `${window.origin}/account/login/redirect/google`,
    prompt: 'select_account',
    scope: 'profile email',
  });
  /* eslint-enable */

  return (
    <Button
      startIcon={<GoogleLogo />}
      variant="contained"
      href={`https://accounts.google.com/o/oauth2/v2/auth?${query}`}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
