import React, { useContext } from 'react';
import { MatchContext, MatchState } from 'state/match';
import MatchOutline from './MatchOutline';

const getMatchInProgressChild = (
  state: MatchState
): React.ReactElement<any> => {
  // Game is running
  if (state.gameInProgress) {
    if (state.selectedMove) {
      return <WaitingForOpponentMove />;
    }
    return <SelectAMove />;
  }

  // Game is over
  if (state.matchOutcome) {
    return <MatchEnd />;
  }
  return <GameEnd />;
};

const Match: React.FC = () => {
  const { state } = useContext(MatchContext);

  // No opponent
  if (!state.opponentName) {
    return <WaitingForOpponent />;
  }

  return <MatchOutline>{getMatchInProgressChild(state)}</MatchOutline>;
};

export default Match;
