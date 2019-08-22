import { Button } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

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
    <Link to={`/login${paramsStr}`}>
      <Button variant={variant} color={color}>
        Log In
      </Button>
    </Link>
  );
};

export default withRouter(LogInButton);
