import { createMuiTheme, CssBaseline, LinearProgress } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import useFetch from 'hooks/useFetch';
import React, { useReducer, useCallback } from 'react';
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
  useFetch<User>('/api/current-user', {
    onRequest: useCallback(
      () => userDispatch({ type: UserActionType.Loading }),
      []
    ),
    onSuccess: useCallback(
      data =>
        userDispatch({
          type: UserActionType.Login,
          user: data,
        }),
      []
    ),
    onError: useCallback(
      () => userDispatch({ type: UserActionType.LoginError }),
      []
    ),
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {userState.loading ? (
          <LinearProgress />
        ) : (
          <UserStateContext.Provider value={userState}>
            <UserDispatchContext.Provider value={userDispatch}>
              <HeaderBar />
              <PageRouteContainer />
            </UserDispatchContext.Provider>
          </UserStateContext.Provider>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
