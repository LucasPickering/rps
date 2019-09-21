import React, { useContext } from 'react';
import { LiveMatchDataContext } from 'state/livematch';
import useStyles from 'hooks/useStyles';
import { Typography } from '@material-ui/core';
import MatchLink from '../MatchLink';

/**
 * Game and match status messages for a spectator. Nothing interactive here.
 */
const SpectatorMatchStatus: React.FC = () => {
  const classes = useStyles();
  const { permanentMatch, winner } = useContext(LiveMatchDataContext);

  // Match is over

  return (
    <>
      {permanentMatch && winner && (
        <>
          <MatchLink matchId={permanentMatch}>
            <Typography className={classes.normalMessage}>
              Match Over
            </Typography>
          </MatchLink>
          <Typography className={classes.majorMessage}>
            {winner} won!
          </Typography>
        </>
      )}
    </>
  );
};

export default SpectatorMatchStatus;
