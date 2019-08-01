import { useContext } from 'react';
import { User, UserStateContext } from 'state/user';

/**
 * Hook for getting current user data.
 */
export default (): User | undefined => useContext(UserStateContext).user;
