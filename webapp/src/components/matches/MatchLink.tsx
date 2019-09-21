import React from 'react';
import Link from 'components/common/Link';

const MatchLink: React.FC<
  { matchId: number } & Omit<React.ComponentProps<typeof Link>, 'to'>
> = ({ matchId, children, ...rest }) => (
  <Link to={`/matches/${matchId}`} {...rest}>
    {children}
  </Link>
);

export default MatchLink;
