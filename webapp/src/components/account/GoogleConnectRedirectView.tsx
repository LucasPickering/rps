import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router';
import PageLayout from 'components/common/PageLayout';
import queryString from 'query-string';
import useRequest from 'hooks/useRequest';
import ApiDisplay from 'components/common/ApiDisplay';

interface RequestData {
  code: string;
  username?: string;
}

const GoogleConnectRedirectView: React.FC = () => {
  const { search } = useLocation();
  const query = queryString.parse(search);
  const code = (query.code || '').toString();

  const { request, state } = useRequest<{}, {}, undefined, RequestData>({
    url: '/api/mgt/google/connect/',
    method: 'POST',
  });

  useEffect(() => {
    request({ data: { code } });
  }, [request, code]);

  return (
    <PageLayout maxWidth="xs">
      <ApiDisplay state={state}>
        {() => <Redirect to="/account/connect" />}
      </ApiDisplay>
    </PageLayout>
  );
};

export default GoogleConnectRedirectView;
