import { useContext, useCallback, useMemo } from 'react';
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
const useUser = (): { user: User | undefined; requestUser: () => void } => {
  const { user } = useContext(UserStateContext);
  const userDispatch = useContext(UserDispatchContext);

  // Function to fetch user data and store it
  const { request } = useRequest<User>({ url: '/api/auth/user/' });
  const requestUser = useCallback(() => {
    request()
      .then(data => userDispatch({ type: UserActionType.Login, user: data }))
      .catch(() => userDispatch({ type: UserActionType.Logout }));
    userDispatch({ type: UserActionType.Loading });
  }, [request, userDispatch]);

  return useMemo(
    () => ({
      user,
      requestUser,
    }),
    [user, requestUser]
  );
};

export default useUser;
