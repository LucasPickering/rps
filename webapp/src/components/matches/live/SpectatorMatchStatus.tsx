import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { LiveMatchDataContext } from 'state/livematch';
import useLiveMatchStyles from './useLiveMatchStyles';
import MatchLink from '../MatchLink';

/**
 * Game and match status messages for a spectator. Nothing interactive here.
 */
const SpectatorMatchStatus: React.FC = () => {
  const liveMatchClasses = useLiveMatchStyles();
  const { permanentMatch, winner } = useContext(LiveMatchDataContext);

  // Match is over

  return permanentMatch && winner ? (
    <>
      <MatchLink matchId={permanentMatch}>
        <Typography className={liveMatchClasses.normalMessage}>
          Match Over
        </Typography>
      </MatchLink>
      <Typography className={liveMatchClasses.majorMessage}>
        {winner} won!
      </Typography>
    </>
  ) : null;
};

export default SpectatorMatchStatus;
