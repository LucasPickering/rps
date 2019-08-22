import { AppBar, Button, Toolbar, makeStyles } from '@material-ui/core';
import useUser from 'hooks/useUser';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import routes from 'util/routes';
import LogOutButton from './login/LogOutButton';
import NewMatchButton from './NewMatchButton';

const useLocalStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}));

const HeaderBar: React.FC<RouteComponentProps> = ({ location }) => {
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
          // TODO include query params here
          <Link to={routes.login.build({}, { next: location.pathname })}>
            <Button>Log In</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(HeaderBar);
