import React from 'react';
import Link from 'components/common/Link';

const MatchLink: React.FC<{ matchId: number }> = ({ matchId, children }) => (
  <Link to={`/matches/${matchId}`}>{children}</Link>
);

export default MatchLink;
