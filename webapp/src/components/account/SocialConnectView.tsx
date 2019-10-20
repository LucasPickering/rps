import React from 'react';
import PageLayout from 'components/common/PageLayout';
import GoogleLoginButton from './GoogleLoginButton';
import Form from 'components/common/Form';
import useGetRequest from 'hooks/useGetRequest';
import { CircularProgress } from '@material-ui/core';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import { SocialAccount } from 'state/user';
import { PaginatedResponse } from 'state/api';

const SocialConnectView: React.FC = () => {
  const { loading, data, error } = useGetRequest<
    PaginatedResponse<SocialAccount[]>
  >('/api/auth/socialaccounts/');

  return (
    <PageLayout maxWidth="xs" restriction="loggedIn">
      {loading && <CircularProgress />}
      {data && (
        <Form>
          <GoogleLoginButton
            connect
            disabled={data.results.some(acc => acc.provider === 'google')}
          />
        </Form>
      )}
      <ApiErrorDisplay error={error} />
    </PageLayout>
  );
};

export default SocialConnectView;
