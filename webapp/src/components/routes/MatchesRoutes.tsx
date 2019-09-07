import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LiveMatchView from 'components/matches/live/LiveMatchView';
import NewLiveMatchView from 'components/matches/live/NewLiveMatchView';
import MatchView from 'components/matches/MatchView';
import NotFoundView from 'components/NotFoundView';

const MatchesRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/matches/:matchId" component={MatchView} exact />
      <Route path="/matches/live/new" component={NewLiveMatchView} exact />
      <Route path="/matches/live/:matchId" component={LiveMatchView} exact />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default MatchesRoutes;
