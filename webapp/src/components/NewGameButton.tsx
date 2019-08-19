import axios from 'axios';
import { Button } from '@material-ui/core';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import routes from 'util/routes';

const NewGameButton: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() =>
        axios
          .get('/api/matches/new')
          .then(resp =>
            history.push(routes.match.build({ matchId: resp.data.match_id }))
          )
      }
    >
      New Game
    </Button>
  );
};

export default withRouter(NewGameButton);
