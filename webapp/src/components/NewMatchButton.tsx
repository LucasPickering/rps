import { Button } from '@material-ui/core';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import routes from 'util/routes';
import useRequest from 'hooks/useRequest';

const NewMatchButton: React.FC<RouteComponentProps> = ({ history }) => {
  const { request } = useRequest<{ match_id: string }>({
    url: '/api/matches/new',
    method: 'GET',
  });

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() =>
        request().then(data =>
          history.push(routes.match.build({ matchId: data.match_id }, {}))
        )
      }
    >
      New Match
    </Button>
  );
};

export default withRouter(NewMatchButton);
