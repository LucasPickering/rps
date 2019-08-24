import { Button } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import queryString from 'query-string';
import ButtonLink from 'components/core/ButtonLink';

/**
 * Just a link component to the login page. But, because this is used in
 * multiple places and it has logic to handle forward the current URL, it's
 * worth having its own component.
 */
const LogInButton: React.FC<
  RouteComponentProps &
    Pick<React.ComponentProps<typeof Button>, 'variant' | 'color'>
> = ({ location: { pathname }, variant, color }) => {
  const paramsStr =
    pathname !== 'login'
      ? '?' + queryString.stringify({ next: pathname }, { encode: false })
      : '';
  return (
    // TODO include query params here
    <ButtonLink to={`/login${paramsStr}`} variant={variant} color={color}>
      Log In
    </ButtonLink>
  );
};

export default withRouter(LogInButton);
