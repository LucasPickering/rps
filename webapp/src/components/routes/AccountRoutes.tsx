import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginView from 'components/account/LoginView';
import ResetPasswordView from 'components/account/ResetPasswordView';

const AccountRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/account/login" component={LoginView} exact />
      <Route
        path="/account/password/reset/confirm/:uid/:token"
        component={ResetPasswordView}
        exact
      />
    </Switch>
  );
};

export default AccountRoutes;