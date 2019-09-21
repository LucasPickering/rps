import React, { useContext } from 'react';
import { LiveMatchDataContext } from 'state/livematch';
import ButtonLink from 'components/common/ButtonLink';

/**
 * Actions available to match spectators.
 */
const SpectatorActions: React.FC = () => {
  const { rematch } = useContext(LiveMatchDataContext);

  // Match is over

  return (
    <>
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
