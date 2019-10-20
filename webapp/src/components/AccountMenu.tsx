import { IconButton, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import { AccountCircle as IconAccountCircle } from '@material-ui/icons';
import Link from 'components/common/Link';
import useUser from 'hooks/useUser';

const AccountMenu: React.FC = () => {
  const { logOut } = useUser();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>(
    undefined
  );

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
        <Link to="/account/connect">
          <MenuItem>Connect Account</MenuItem>
        </Link>
        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
