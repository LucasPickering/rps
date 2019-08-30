import { IconButton, Menu, MenuItem } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import { AccountCircle as IconAccountCircle } from '@material-ui/icons';
import useRequest from 'hooks/useRequest';
import { UserDispatchContext, UserActionType } from 'state/user';
import { RouteComponentProps, withRouter } from 'react-router';

const AccountMenu: React.FC<RouteComponentProps> = ({ history }) => {
  const userDispatch = useContext(UserDispatchContext);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>(
    undefined
  );
  const { request: logOutRequest } = useRequest<{}>({
    url: '/api/auth/logout/',
    method: 'POST',
  });

  return (
    <>
      <IconButton
        aria-controls="menu-list-grow"
        aria-haspopup="true"
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <IconAccountCircle />
      </IconButton>
      <Menu
        id="account-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        getContentAnchorEl={undefined}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => setAnchorEl(undefined)}
      >
        <MenuItem
          onClick={() => {
            logOutRequest().then(() => {
              userDispatch({
                type: UserActionType.Logout,
              });
              history.push('');
            });
          }}
        >
          Log Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default withRouter(AccountMenu);
