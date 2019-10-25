import { useContext, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import {
  User,
  UserStateContext,
  UserDispatchContext,
  UserActionType,
} from 'state/user';
import useRequest from './useRequest';

/**
 * Hook for getting current user data and a function to request new user data.
 */
const useUser = (): {
  loading: boolean;
  user: User | undefined;
  requestUser: () => void;
  logOut: () => void;
} => {
  const history = useHistory();
  const { loading, user } = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  // Function to fetch user data and store it
  const { request } = useRequest<User>({ url: '/api/mgt/user/' });
  const requestUser = useCallback(() => {
    request()
      .then(data => userDispatch({ type: UserActionType.Login, user: data }))
      .catch(() => userDispatch({ type: UserActionType.Logout }));
    userDispatch({ type: UserActionType.Loading });
  }, [request, userDispatch]);

  // Function to log out
  const { request: logOutRequest } = useRequest<{}>({
    url: '/api/mgt/logout/',
    method: 'POST',
  });
  const logOut = useCallback(() => {
    logOutRequest().then(() => {
      userDispatch({
        type: UserActionType.Logout,
      });
      history.push('');
    });
  }, [logOutRequest, userDispatch, history]);

  return useMemo(
    () => ({
      loading,
      user,
      requestUser,
      logOut,
    }),
    [loading, user, requestUser, logOut]
  );
};

export default useUser;
