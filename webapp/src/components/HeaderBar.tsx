import { AppBar, Button, Toolbar, makeStyles } from '@material-ui/core';
import useUser from 'hooks/useUser';
import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'util/routes';
import LogOutButton from './login/LogOutButton';
import LogInButton from './login/LogInButton';

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
        {user && (
          <Link to={routes.match.build({ matchId: 'new' }, {})}>
            <Button color="secondary" variant="contained">
              New Match
            </Button>
          </Link>
        )}
        <div className={localClasses.grow} />
        {user ? <LogOutButton /> : <LogInButton />}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
