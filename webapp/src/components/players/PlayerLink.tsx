import React from 'react';
import Link from 'components/common/Link';

const PlayerLink: React.FC<{ username: string }> = ({ username, children }) => (
  <Link to={`/players/${username}`}>{children}</Link>
);

export default PlayerLink;
