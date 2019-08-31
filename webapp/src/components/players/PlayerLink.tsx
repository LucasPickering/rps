import React from 'react';
import Link from 'components/common/Link';

const PlayerLink: React.FC<{ username: string }> = ({ username }) => (
  <Link to={`/players/${username}`}>{username}</Link>
);

export default PlayerLink;
