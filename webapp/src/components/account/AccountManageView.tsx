import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { countBy } from 'lodash';
import PageLayout from 'components/common/PageLayout';
import useGetRequest from 'hooks/useGetRequest';
import { PaginatedResponse } from 'state/api';
import { SocialAccount } from 'state/user';
import ApiDisplay from 'components/common/ApiDisplay';
import Form from 'components/common/Form';
import GoogleLoginButton from './GoogleLoginButton';

enum SocialProvider {
  Google = 'google',
}

const useLocalStyles = makeStyles({
  socialAccountWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const AccountManageView: React.FC = () => {
  const localClasses = useLocalStyles();
  const socialAccountsState = useGetRequest<PaginatedResponse<SocialAccount[]>>(
    '/api/auth/socialaccounts/'
  );

  return (
    <PageLayout restriction="loggedIn">
      <Grid container>
        <Grid className={localClasses.socialAccountWrapper} item xs={12}>
          <ApiDisplay state={socialAccountsState}>
            {data => {
              const counts = countBy(data.results, 'provider');
              return (
                <Form title="Social Accounts">
                  <GoogleLoginButton connect />
                  <Typography>
                    {counts[SocialProvider.Google] || 0} accounts connected
                  </Typography>
                </Form>
              );
            }}
          </ApiDisplay>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default AccountManageView;
