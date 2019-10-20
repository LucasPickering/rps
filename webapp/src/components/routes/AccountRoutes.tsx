import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginView from 'components/account/LoginView';
import SocialConnectView from 'components/account/SocialConnectView';
import NotFoundView from 'components/NotFoundView';
import GoogleLoginRedirectView from 'components/account/GoogleLoginRedirectView';
import GoogleConnectRedirectView from 'components/account/GoogleConnectRedirectView';

const AccountRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/account/login" component={LoginView} exact />
      <Route path="/account/connect" component={SocialConnectView} exact />

      <Route
        path="/account/login/redirect/google"
        component={GoogleLoginRedirectView}
        exact
      />
      <Route
        path="/account/connect/redirect/google"
        component={GoogleConnectRedirectView}
        exact
      />

      <Route component={NotFoundView} />
    </Switch>
  );
};

export default AccountRoutes;
