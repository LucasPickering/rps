import { Button } from '@material-ui/core';
import axios from 'axios'; // tslint:disable-line match-default-export-name
import React, { useContext } from 'react';
import { UserActionType, UserDispatchContext } from 'state/user';

const LogOutButton: React.FC = () => {
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
        });
      }}
    >
      Log Out
    </Button>
  );
};

export default LogOutButton;
