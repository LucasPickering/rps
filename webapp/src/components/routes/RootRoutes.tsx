import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from 'components/Home';
import LoginView from 'components/login/LoginView';
import NotFound from 'components/NotFound';
import MatchRoutes from './MatchRoutes';

/**
 * Top-level routes.
 */
const RootRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/login" component={LoginView} exact />
      <Route path="/matches" component={MatchRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default RootRoutes;
