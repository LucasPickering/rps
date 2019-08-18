import { createMuiTheme, CssBaseline, LinearProgress } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import useFetch from 'hooks/useFetch';
import React, { useReducer } from 'react';
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
    onRequest: () => userDispatch({ type: UserActionType.Loading }),
    onSuccess: data =>
      userDispatch({
        type: UserActionType.Login,
        user: data,
      }),
    onError: () => userDispatch({ type: UserActionType.LoginError }),
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
