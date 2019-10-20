import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import PageLayout from 'components/common/PageLayout';
import queryString from 'query-string';
import useRequest from 'hooks/useRequest';
import { CircularProgress } from '@material-ui/core';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import useUser from 'hooks/useUser';
import LoginRedirect from './LoginRedirect';

interface RequestData {
  code: string;
  username?: string;
}

const GoogleConnectRedirect: React.FC = () => {
  const { requestUser } = useUser();
  const { search } = useLocation();
  const query = queryString.parse(search);
  const code = (query.code || '').toString();

  const {
    request,
    state: { loading, error },
  } = useRequest<{}, {}, undefined, RequestData>({
    url: '/api/auth/google/connect/',
    method: 'POST',
  });

  useEffect(() => {
    request({ data: { code } }).then(requestUser);
  }, [request, code, requestUser]);

  return (
    <PageLayout maxWidth="xs">
      <LoginRedirect />
      {loading && <CircularProgress />}
      <ApiErrorDisplay error={error} />
    </PageLayout>
  );
};

export default GoogleConnectRedirect;
