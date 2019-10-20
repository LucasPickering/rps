import { IconButton, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import { AccountCircle as IconAccountCircle } from '@material-ui/icons';
import Link from 'components/common/Link';
import useUser from 'hooks/useUser';
import { makePlayerRoute } from 'util/routes';

const AccountMenu: React.FC = () => {
  const { user, logOut } = useUser();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>(
    undefined
  );

  // This should only render when the user is logged in
  if (!user) {
    return null;
  }

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
          component={Link}
          to={makePlayerRoute(user.username)}
          styled={false}
        >
          My Profile
        </MenuItem>
        <MenuItem component={Link} to="/account/connect" styled={false}>
          Connect Social
        </MenuItem>
        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
