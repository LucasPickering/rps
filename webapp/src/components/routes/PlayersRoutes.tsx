import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PlayerView from 'components/players/PlayerView';
import PlayersView from 'components/players/PlayersView';
import NotFoundView from 'components/NotFoundView';

const PlayersRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/players" component={PlayersView} exact />
      <Route path="/players/:username" component={PlayerView} exact />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default PlayersRoutes;
