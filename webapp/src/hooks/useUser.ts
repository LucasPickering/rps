import { useContext } from 'react';
import { User, UserStateContext } from 'state/user';

/**
 * Hook for getting current user data.
 */
const useUser = (): User | undefined => useContext(UserStateContext).user;

export default useUser;
