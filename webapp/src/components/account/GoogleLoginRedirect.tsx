import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import PageLayout from 'components/common/PageLayout';
import queryString from 'query-string';
import useRequest from 'hooks/useRequest';
import { CircularProgress, TextField } from '@material-ui/core';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import useUser from 'hooks/useUser';
import LoginRedirect from './LoginRedirect';
import LoadingButton from 'components/common/LoadingButton';
import Form from 'components/common/Form';

interface RequestData {
  accessToken: string;
  username?: string;
}

const GoogleLoginRedirect: React.FC = () => {
  // NOTE: A lot of this is dead code, because right now I haven't figured out
  // how to make django-allauth require a username input from the user. Leaving
  // the username form code in for now though, might be able to use it later.

  const { requestUser } = useUser();
  const { hash } = useLocation();
  const query = queryString.parse(hash);
  const accessToken = (query.access_token || '').toString();
  const [requireUsername, setRequireUsername] = useState(false);
  const [username, setUsername] = useState('');

  const {
    request,
    state: { loading, error },
  } = useRequest<{}, {}, undefined, RequestData>({
    url: '/api/auth/google/',
    method: 'POST',
  });

  useEffect(() => {
    request({ data: { accessToken } })
      .then(requestUser)
      .catch(() => {
        // TODO better error checking
        setRequireUsername(true);
      });
  }, [request, accessToken, requestUser]);

  return (
    <PageLayout maxWidth="xs">
      <LoginRedirect />
      {requireUsername ? (
        <Form
          onSubmit={() => {
            request({ data: { accessToken, username } }).then(requestUser);
          }}
        >
          <TextField
            id="username"
            label="Username"
            value={username}
            onChange={e => setUsername(e.currentTarget.value)}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={loading}
            // disabled={!username}
          >
            Sign Up
          </LoadingButton>
        </Form>
      ) : (
        loading && <CircularProgress />
      )}
      <ApiErrorDisplay error={error} />
    </PageLayout>
  );
};

export default GoogleLoginRedirect;
