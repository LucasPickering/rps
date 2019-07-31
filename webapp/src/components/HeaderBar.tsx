import { AppBar, Button, Toolbar } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'util/routes';

const HeaderBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to={routes.login.build({})}>
          <Button variant="contained" color="secondary">
            Log In
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
