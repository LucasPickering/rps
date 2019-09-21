import React, { useContext } from 'react';
import { LiveMatchDataContext } from 'state/livematch';
import useStyles from 'hooks/useStyles';
import ButtonLink from 'components/common/ButtonLink';
import { Typography } from '@material-ui/core';
import MatchLink from '../MatchLink';

/**
 * Actions available to match spectators.
 */
const SpectatorActions: React.FC = () => {
  const classes = useStyles();
  const { permanentMatch, winner, rematch } = useContext(LiveMatchDataContext);

  // Match is over

  return (
    <>
      {permanentMatch && winner && (
        <>
          <MatchLink matchId={permanentMatch} title="Permanent match page">
            <Typography className={classes.normalMessage}>
              Match Over
            </Typography>
          </MatchLink>
          <Typography className={classes.majorMessage}>
            {winner} won!
          </Typography>
        </>
      )}
      {rematch && (
        <ButtonLink
          to={`/matches/live/${rematch}`}
          variant="contained"
          color="primary"
        >
          Spectate Rematch
        </ButtonLink>
      )}
    </>
  );
};

export default SpectatorActions;
