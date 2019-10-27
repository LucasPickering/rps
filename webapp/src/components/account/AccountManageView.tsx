import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import PageLayout from 'components/common/PageLayout';
import useStyles from 'hooks/useStyles';
import useGetRequest from 'hooks/useGetRequest';
import { PaginatedResponse } from 'state/api';
import { SocialAccount } from 'state/user';
import ApiDisplay from 'components/common/ApiDisplay';
import Form from 'components/common/Form';
import GoogleLoginButton from './GoogleLoginButton';

const AccountManageView: React.FC = () => {
  const classes = useStyles();
  const socialAccountsState = useGetRequest<PaginatedResponse<SocialAccount[]>>(
    '/api/auth/socialaccounts/'
  );

  return (
    <PageLayout restriction="loggedIn">
      <Grid container>
        <Grid item xs={12}>
          <ApiDisplay state={socialAccountsState}>
            {data => (
              <Form>
                <Typography className={classes.panelTitle}>
                  Social Accounts
                </Typography>
                <GoogleLoginButton
                  connect
                  disabled={data.results.some(acc => acc.provider === 'google')}
                />
              </Form>
            )}
          </ApiDisplay>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default AccountManageView;
