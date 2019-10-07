import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React, { useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  defaultUserState,
  UserDispatchContext,
  userReducer,
  UserStateContext,
} from 'state/user';
import theme from 'util/theme';

import PageContainer from './PageContainer';

const App: React.FC = () => {
  const [userState, userDispatch] = useReducer(userReducer, defaultUserState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <UserStateContext.Provider value={userState}>
          <UserDispatchContext.Provider value={userDispatch}>
            <PageContainer />
          </UserDispatchContext.Provider>
        </UserStateContext.Provider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
