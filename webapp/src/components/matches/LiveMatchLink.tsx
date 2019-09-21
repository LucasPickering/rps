import React from 'react';
import Link from 'components/common/Link';

const LiveMatchLink: React.FC<
  { matchId: string } & Omit<React.ComponentProps<typeof Link>, 'to'>
> = ({ matchId, children, ...rest }) => (
  <Link to={`/matches/live/${matchId}`} {...rest}>
    {children}
  </Link>
);

export default LiveMatchLink;
