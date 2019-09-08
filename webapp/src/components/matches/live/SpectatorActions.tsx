import React, { useContext } from 'react';
import { LiveMatchContext } from 'state/livematch';
import useStyles from 'hooks/useStyles';
import ButtonLink from 'components/common/ButtonLink';
import { Typography } from '@material-ui/core';

/**
 * Actions available to match spectators.
 */
const SpectatorActions: React.FC = () => {
  const classes = useStyles();
  const {
    data: { winner, rematch },
  } = useContext(LiveMatchContext);

  // Match is over

  return (
    <>
      {winner && (
        <>
          <Typography className={classes.normalMessage}>Match Over</Typography>
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
