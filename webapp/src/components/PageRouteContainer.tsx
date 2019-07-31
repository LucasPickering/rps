import { Container, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { Route } from 'react-router-dom';
import routes from 'util/routes';
import Home from './Home';
import MatchView from './match/MatchView';

const useLocalStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(4),
  },
}));

const PageRouteContainer: React.FC = () => {
  const localClasses = useLocalStyles();
  return (
    <Container className={localClasses.root} maxWidth={false}>
      <Route path={routes.home.route} component={Home} exact />
      <Route path={routes.match.route} component={MatchView} exact />
    </Container>
  );
};

export default PageRouteContainer;
