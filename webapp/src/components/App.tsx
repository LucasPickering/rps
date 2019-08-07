import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import useFetch from 'hooks/useFetch';
import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  defaultUserState,
  User,
  UserActionType,
  UserDispatchContext,
  userReducer,
  UserStateContext,
} from 'state/user';
import HeaderBar from './HeaderBar';
import PageRouteContainer from './PageRouteContainer';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  const [userState, userDispatch] = useReducer(userReducer, defaultUserState);

  // Kick off a request to fetch user data
  const { data: userData } = useFetch<User>('/api/current-user');
  useEffect(() => {
    if (userData) {
      userDispatch({
        type: UserActionType.Login,
        user: userData,
      });
    }
  }, [userData]);

  return (
    <ThemeProvider theme={theme}>
      <UserStateContext.Provider value={userState}>
        <UserDispatchContext.Provider value={userDispatch}>
          <Router>
            <CssBaseline />
            <HeaderBar />
            <PageRouteContainer />
          </Router>
        </UserDispatchContext.Provider>
      </UserStateContext.Provider>
    </ThemeProvider>
  );
};

export default App;
