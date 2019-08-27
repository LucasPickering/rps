import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { UserActionType, UserDispatchContext } from 'state/user';
import { RouteComponentProps, withRouter } from 'react-router';
import useRequest from 'hooks/useRequest';

const LogOutButton: React.FC<RouteComponentProps> = ({ history }) => {
  const userDispatch = useContext(UserDispatchContext);
  const { request } = useRequest<{}>({
    url: '/api/auth/logout/',
    method: 'POST',
  });

  return (
    <Button
      size="small"
      onClick={() => {
        request().then(() => {
          userDispatch({
            type: UserActionType.Logout,
          });
          history.push('');
        });
      }}
    >
      Log Out
    </Button>
  );
};

export default withRouter(LogOutButton);
