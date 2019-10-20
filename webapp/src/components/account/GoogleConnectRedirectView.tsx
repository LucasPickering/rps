import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router';
import PageLayout from 'components/common/PageLayout';
import queryString from 'query-string';
import useRequest from 'hooks/useRequest';
import { CircularProgress } from '@material-ui/core';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';

interface RequestData {
  code: string;
  username?: string;
}

const GoogleConnectRedirectView: React.FC = () => {
  const { search } = useLocation();
  const query = queryString.parse(search);
  const code = (query.code || '').toString();

  const {
    request,
    state: { loading, data, error },
  } = useRequest<{}, {}, undefined, RequestData>({
    url: '/api/auth/google/connect/',
    method: 'POST',
  });

  useEffect(() => {
    request({ data: { code } });
  }, [request, code]);

  return (
    <PageLayout maxWidth="xs">
      {loading && <CircularProgress />}
      {data && <Redirect to="/account/connect" />}
      <ApiErrorDisplay error={error} />
    </PageLayout>
  );
};

export default GoogleConnectRedirectView;
