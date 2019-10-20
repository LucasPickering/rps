import React from 'react';
import Link from 'components/common/Link';

const PlayerLink: React.FC<
  { username: string } & Omit<
    React.ComponentProps<typeof Link>,
    'to' | 'styled'
  >
> = ({ username, children, ...rest }) => (
  <Link to={`/players/${username}`} {...rest}>
    {children}
  </Link>
);

export default PlayerLink;
