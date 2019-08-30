import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeView from 'components/HomeView';
import NotFoundView from 'components/NotFoundView';
import MatchRoutes from './MatchRoutes';
import AccountRoutes from './AccountRoutes';

/**
 * Top-level routes.
 */
const RootRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={HomeView} exact />
      <Route path="/account" component={AccountRoutes} />
      <Route path="/matches" component={MatchRoutes} />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default RootRoutes;
