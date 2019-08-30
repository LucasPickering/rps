import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeView from 'components/HomeView';
import LoginView from 'components/account/LoginView';
import ResetPasswordView from 'components/account/ResetPasswordView';
import NotFoundView from 'components/NotFoundView';
import MatchRoutes from './MatchRoutes';

/**
 * Top-level routes.
 */
const RootRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={HomeView} exact />
      <Route path="/login" component={LoginView} exact />
      <Route
        path="/account/password/reset/confirm/:uid/:token"
        component={ResetPasswordView}
        exact
      />
      <Route path="/matches" component={MatchRoutes} />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default RootRoutes;
