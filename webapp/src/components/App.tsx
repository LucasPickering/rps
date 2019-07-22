import { createMuiTheme, CssBaseline, Grid } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes from 'util/routes';
import Home from './Home';
import Match from './Match';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Router>
            <CssBaseline />
            <Route path={routes.home.route} component={Home} exact />
            <Route path={routes.match.route} component={Match} exact />
          </Router>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
