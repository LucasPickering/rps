import React from 'react';
import withRouteParams from 'hoc/withRouteParams';

const PlayerView: React.FC<{
  username: string;
}> = ({ username }) => {
  return <>{username}</>;
};

export default withRouteParams(PlayerView);
