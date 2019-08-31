import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PlayerView from 'components/players/PlayerView';

const PlayersRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/players/:username" component={PlayerView} exact />
    </Switch>
  );
};

export default PlayersRoutes;
