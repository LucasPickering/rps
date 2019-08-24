import { createMuiTheme, CssBaseline, LinearProgress } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React, { useReducer, useEffect } from 'react';
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
import useRequest from 'hooks/useRequest';
import PageContainer from './PageContainer';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  const [userState, userDispatch] = useReducer(userReducer, defaultUserState);
  const { request } = useRequest<User>({ url: '/api/current-user/' });

  // Kick off a request to fetch user data
  useEffect(() => {
    userDispatch({ type: UserActionType.Loading });
    request().then(data => {
      // This endpoint should always return 200. Empty data indicates we're
      // not logged in.
      userDispatch(
        data
          ? {
              type: UserActionType.Login,
              user: data,
            }
          : { type: UserActionType.Logout }
      );
    });
  }, [request]);

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
              <PageContainer />
            </UserDispatchContext.Provider>
          </UserStateContext.Provider>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
