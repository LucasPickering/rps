import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LiveMatchView from 'components/matches/live/LiveMatchView';

const MatchRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/matches/live/:matchId" component={LiveMatchView} exact />
    </Switch>
  );
};

export default MatchRoutes;
