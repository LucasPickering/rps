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
  RouteComponentProps & React.ComponentProps<typeof Button>
> = ({ location, ...rest }) => {
  return (
    // TODO include query params here
    <Link to={`/login?${queryString.stringify({ next: location.pathname })}`}>
      <Button {...rest}>Log In</Button>
    </Link>
  );
};

export default withRouter(LogInButton);
