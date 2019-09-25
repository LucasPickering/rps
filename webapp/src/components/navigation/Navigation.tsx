import {
  AppBar,
  Toolbar,
  makeStyles,
  SwipeableDrawer,
  IconButton,
  List,
} from '@material-ui/core';
import { Menu as IconMenu } from '@material-ui/icons';
import React, { useState } from 'react';
import ButtonLink from '../common/ButtonLink';
import AccountMenu from '../AccountMenu';
import useUser from 'hooks/useUser';
import LogInButton from 'components/account/LogInButton';
import HeaderLink from './HeaderLink';
import DrawerLink from './DrawerLink';
import useScreenSize from 'hooks/useScreenSize';

const LINKS = [
  {
    to: '/',
    label: 'Home',
    exact: true,
  },
  {
    to: '/players',
    label: 'Players',
    exact: false,
  },
];

const useLocalStyles = makeStyles(({ spacing }) => ({
  drawer: {
    width: 150,
  },
  grow: {
    flexGrow: 1,
  },
  newMatchButton: {
    margin: spacing(1),
  },
}));

const Navigation: React.FC = () => {
  const localClasses = useLocalStyles();
  const { user } = useUser();
  const drawerNavEnabled = useScreenSize() === 'small';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = (): void => setDrawerOpen(true);
  const closeDrawer = (): void => setDrawerOpen(false);

  return (
    <AppBar position="static" color="default">
      <Toolbar component="nav" variant="dense">
        {drawerNavEnabled ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={openDrawer}
            edge="start"
          >
            <IconMenu />
          </IconButton>
        ) : (
          LINKS.map(({ to, label, exact }) => (
            <HeaderLink key={to} to={to} exact={exact}>
              {label}
            </HeaderLink>
          ))
        )}
        <div className={localClasses.grow} />
        {user && (
          <ButtonLink
            className={localClasses.newMatchButton}
            to="/matches/live/new"
            color="primary"
            variant="outlined"
            size="small"
          >
            New Match
          </ButtonLink>
        )}
        {user ? <AccountMenu /> : <LogInButton />}
      </Toolbar>
      {drawerNavEnabled && (
        <SwipeableDrawer
          open={drawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
        >
          <List className={localClasses.drawer} component="nav">
            {LINKS.map(({ to, label, exact }) => (
              <DrawerLink key={to} to={to} exact={exact} onClick={closeDrawer}>
                {label}
              </DrawerLink>
            ))}
          </List>
        </SwipeableDrawer>
      )}
    </AppBar>
  );
};

export default Navigation;
