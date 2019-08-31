import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeView from 'components/HomeView';
import NotFoundView from 'components/NotFoundView';
import MatchesRoutes from './MatchesRoutes';
import AccountRoutes from './AccountRoutes';
import PlayersRoutes from './PlayersRoutes';

/**
 * Top-level routes.
 */
const RootRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={HomeView} exact />
      <Route path="/account" component={AccountRoutes} />
      <Route path="/matches" component={MatchesRoutes} />
      <Route path="/players" component={PlayersRoutes} />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default RootRoutes;
