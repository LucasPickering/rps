import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { LiveMatchDataContext } from 'state/livematch';
import useLiveMatchStyles from './useLiveMatchStyles';
import { makeMatchLink } from 'util/routes';
import Link from 'components/common/Link';

/**
 * Game and match status messages for a spectator. Nothing interactive here.
 */
const SpectatorMatchStatus: React.FC = () => {
  const liveMatchClasses = useLiveMatchStyles();
  const { permanentMatch, winner } = useContext(LiveMatchDataContext);

  // Match is over

  return permanentMatch && winner ? (
    <>
      <Link to={makeMatchLink(permanentMatch)}>
        <Typography className={liveMatchClasses.normalMessage}>
          Match Over
        </Typography>
      </Link>
      <Typography className={liveMatchClasses.majorMessage}>
        {winner} won!
      </Typography>
    </>
  ) : null;
};

export default SpectatorMatchStatus;
