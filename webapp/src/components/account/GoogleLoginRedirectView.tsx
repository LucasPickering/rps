import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import PageLayout from 'components/common/PageLayout';
import queryString from 'query-string';
import useRequest from 'hooks/useRequest';
import { CircularProgress, TextField } from '@material-ui/core';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import useUser from 'hooks/useUser';
import LoadingButton from 'components/common/LoadingButton';
import Form from 'components/common/Form';

interface RequestData {
  code: string;
  username?: string;
}

const GoogleLoginRedirectView: React.FC = () => {
  // NOTE: A lot of this is dead code, because right now I haven't figured out
  // how to make django-allauth require a username input from the user. Leaving
  // the username form code in for now though, might be able to use it later.

  const { requestUser } = useUser();
  const { search } = useLocation();
  const query = queryString.parse(search);
  const code = (query.code || '').toString();
  const [requireUsername, setRequireUsername] = useState(false);
  const [username, setUsername] = useState('');

  const {
    request,
    state: { loading, error },
  } = useRequest<{}, {}, undefined, RequestData>({
    url: '/api/mgt/google/login/',
    method: 'POST',
  });

  useEffect(() => {
    request({ data: { code } })
      .then(requestUser)
      .catch(() => {
        // TODO better error checking
        setRequireUsername(true);
      });
  }, [request, code, requestUser]);

  return (
    <PageLayout maxWidth="xs" restriction="notLoggedIn">
      {requireUsername ? (
        <Form
          onSubmit={() => {
            request({ data: { code, username } }).then(requestUser);
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

export default GoogleLoginRedirectView;
