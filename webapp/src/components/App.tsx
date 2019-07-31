import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import PageRouteContainer from './PageRouteContainer';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <HeaderBar />
        <PageRouteContainer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
