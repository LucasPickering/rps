import { Button } from '@material-ui/core';
import axios from 'axios'; // tslint:disable-line: match-default-export-name
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import routes from 'util/routes';

interface Props {
  matchId: string;
}

const Home: React.FC<Props> = () => {
  const [matchId, setMatchId] = useState<string | undefined>(undefined);
  if (matchId) {
    return <Redirect to={routes.match.build({ matchId })} push />;
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          axios
            .get('/api/matches/new')
            .then(resp => setMatchId(resp.data.match_id))
        }
      >
        New Game
      </Button>
    </div>
  );
};

export default Home;
