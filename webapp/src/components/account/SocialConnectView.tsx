import React from 'react';
import PageLayout from 'components/common/PageLayout';
import GoogleLoginButton from './GoogleLoginButton';
import Form from 'components/common/Form';
import useGetRequest from 'hooks/useGetRequest';
import { SocialAccount } from 'state/user';
import { PaginatedResponse } from 'state/api';
import ApiDisplay from 'components/common/ApiDisplay';

const SocialConnectView: React.FC = () => {
  const state = useGetRequest<PaginatedResponse<SocialAccount[]>>(
    '/api/mgt/socialaccounts/'
  );

  return (
    <PageLayout maxWidth="xs" restriction="loggedIn">
      <ApiDisplay state={state}>
        {data => (
          <Form>
            <GoogleLoginButton
              connect
              disabled={data.results.some(acc => acc.provider === 'google')}
            />
          </Form>
        )}
      </ApiDisplay>
    </PageLayout>
  );
};

export default SocialConnectView;
