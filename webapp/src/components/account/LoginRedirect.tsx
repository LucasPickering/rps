import React from 'react';
import { useLocation, Redirect } from 'react-router';
import queryString from 'query-string';
import useUser from 'hooks/useUser';

/**
 * Component that automatically redirects to the route specified by the ?next=
 * param once user data is loaded.
 */
const LoginRedirect: React.FC = () => {
  const { user } = useUser();
  const { search } = useLocation();

  // User data is present now - get up on outta here
  if (user) {
    const { next } = queryString.parse(search);
    const fixed = Array.isArray(next) ? next[0] : next;
    return <Redirect to={fixed || ''} />;
  }
  return null;
};

export default LoginRedirect;
