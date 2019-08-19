import { AppBar, Button, Toolbar, makeStyles } from '@material-ui/core';
import useUser from 'hooks/useUser';
import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'util/routes';
import LogOutButton from './login/LogOutButton';
import NewMatchButton from './NewMatchButton';

const useLocalStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}));

const HeaderBar: React.FC = () => {
  const localClasses = useLocalStyles();
  const user = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        {user && <NewMatchButton />}
        <div className={localClasses.grow} />
        {user ? (
          <LogOutButton />
        ) : (
          <Link to={routes.login.build({})}>
            <Button>Log In</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
