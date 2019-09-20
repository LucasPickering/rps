import React from 'react';
import Link from 'components/common/Link';

const LiveMatchLink: React.FC<{ matchId: string }> = ({
  matchId,
  children,
}) => <Link to={`/matches/live/${matchId}`}>{children}</Link>;

export default LiveMatchLink;
