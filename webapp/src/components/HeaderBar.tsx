import { AppBar, Toolbar } from '@material-ui/core';
import React, { useState } from 'react';
import Login from './Login';

const HeaderBar: React.FC = () => {
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar>{loginVisible && <Login />}</Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
