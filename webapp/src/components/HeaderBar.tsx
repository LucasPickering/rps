import { AppBar, Toolbar, makeStyles } from '@material-ui/core';
import useUser from 'hooks/useUser';
import React from 'react';
import LogOutButton from 'views/login/LogOutButton';
import LogInButton from 'views/login/LogInButton';
import NavLink from './core/NavLink';
import ButtonLink from './core/ButtonLink';

const useLocalStyles = makeStyles(({ spacing }) => ({
  nav: {},
  grow: {
    flexGrow: 1,
  },
  newMatchButton: {
    margin: spacing(1),
  },
}));

const HeaderBar: React.FC = () => {
  const localClasses = useLocalStyles();
  const user = useUser();

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <nav className={localClasses.nav}>
          <NavLink to="/" exact>
            Home
          </NavLink>
        </nav>
        <div className={localClasses.grow} />
        {user && (
          <ButtonLink
            className={localClasses.newMatchButton}
            to="/matches/live/new"
            color="primary"
            variant="contained"
          >
            New Match
          </ButtonLink>
        )}
        {user ? <LogOutButton /> : <LogInButton />}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
