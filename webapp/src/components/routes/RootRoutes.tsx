import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeView from 'views/HomeView';
import LoginView from 'views/login/LoginView';
import ResetPasswordView from 'views/login/ResetPasswordView';
import NotFoundView from 'views/NotFoundView';
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
        path="/password/reset/:uid/:token"
        component={ResetPasswordView}
        exact
      />
      <Route path="/matches" component={MatchRoutes} />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default RootRoutes;
