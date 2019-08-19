import { Button } from '@material-ui/core';
import axios from 'axios'; // tslint:disable-line match-default-export-name
import React, { useContext } from 'react';
import { UserActionType, UserDispatchContext } from 'state/user';
import { RouteComponentProps, withRouter } from 'react-router';
import routes from 'util/routes';

const LogOutButton: React.FC<RouteComponentProps> = ({ history }) => {
  const userDispatch = useContext(UserDispatchContext);
  return (
    <Button
      variant="contained"
      size="small"
      onClick={() => {
        axios.post('/api/logout').then(() => {
          userDispatch({
            type: UserActionType.Logout,
          });
          history.push(routes.home.build({}));
        });
      }}
    >
      Log Out
    </Button>
  );
};

export default withRouter(LogOutButton);
