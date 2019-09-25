import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginView from 'components/account/LoginView';
import NotFoundView from 'components/NotFoundView';
import GoogleLoginRedirect from 'components/account/GoogleLoginRedirect';

const AccountRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/account/login" component={LoginView} exact />
      <Route
        path="/account/login/redirect/google"
        component={GoogleLoginRedirect}
        exact
      />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default AccountRoutes;
