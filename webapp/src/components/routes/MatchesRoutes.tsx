import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LiveMatchView from 'components/matches/live/LiveMatchView';
import MatchView from 'components/matches/MatchView';

const MatchesRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/matches/:matchId" component={MatchView} exact />
      <Route path="/matches/live/:matchId" component={LiveMatchView} exact />
    </Switch>
  );
};

export default MatchesRoutes;
