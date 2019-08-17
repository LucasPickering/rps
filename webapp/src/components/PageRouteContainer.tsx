import { Container, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { Route } from 'react-router-dom';
import routes from 'util/routes';
import Home from './Home';
import LiveMatchView from './livematch/LiveMatchView';
import LoginView from './login/LoginView';

const useLocalStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(4),
  },
}));

const PageRouteContainer: React.FC = () => {
  const localClasses = useLocalStyles();
  return (
    <Container className={localClasses.root} maxWidth={false}>
      <Route path={routes.home.templateRoute} component={Home} exact />
      <Route path={routes.login.templateRoute} component={LoginView} exact />
      <Route
        path={routes.match.templateRoute}
        component={LiveMatchView}
        exact
      />
    </Container>
  );
};

export default PageRouteContainer;
