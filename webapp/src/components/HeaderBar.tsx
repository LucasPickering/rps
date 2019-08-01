import { AppBar, Button, Toolbar } from '@material-ui/core';
import useUser from 'hooks/useUser';
import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'util/routes';

const HeaderBar: React.FC = () => {
  const user = useUser();
  return (
    <AppBar position="static">
      <Toolbar>
        {!user && (
          <Link to={routes.login.build({})}>
            <Button variant="contained" color="secondary">
              Log In
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
