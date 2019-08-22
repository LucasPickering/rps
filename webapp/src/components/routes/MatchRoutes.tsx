import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LiveMatchContainer from 'components/livematch/LiveMatchContainer';

const MatchRoutes: React.FC = () => {
  return (
    <Switch>
      <Route
        path="/matches/live/:matchId"
        component={LiveMatchContainer}
        exact
      />
    </Switch>
  );
};

export default MatchRoutes;
