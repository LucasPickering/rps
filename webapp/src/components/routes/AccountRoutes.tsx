import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginView from 'components/account/LoginView';
import SocialConnectView from 'components/account/SocialConnectView';
import NotFoundView from 'components/NotFoundView';
import GoogleLoginRedirect from 'components/account/GoogleLoginRedirect';
import GoogleConnectRedirect from 'components/account/GoogleConnectRedirect';

const AccountRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/account/login" component={LoginView} exact />
      <Route path="/account/connect" component={SocialConnectView} exact />

      <Route
        path="/account/login/redirect/google"
        component={GoogleLoginRedirect}
        exact
      />
      <Route
        path="/account/connect/redirect/google"
        component={GoogleConnectRedirect}
        exact
      />

      <Route component={NotFoundView} />
    </Switch>
  );
};

export default AccountRoutes;
