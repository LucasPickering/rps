import { Button } from '@material-ui/core';
import React from 'react';
import ButtonLink from 'components/common/ButtonLink';
import { useLocation } from 'react-router';
import { makeLoginRoute } from 'util/routes';

/**
 * Just a link component to the login page. But, because this is used in
 * multiple places and it has logic to handle forward the current URL, it's
 * worth having its own component.
 */
const LogInButton: React.FC<
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'color'>
> = ({ variant, color }) => {
  const location = useLocation();
  return (
    <ButtonLink to={makeLoginRoute(location)} variant={variant} color={color}>
      Log In
    </ButtonLink>
  );
};

export default LogInButton;
