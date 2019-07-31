import React, { useContext } from 'react';
import { MatchContext, MatchState } from 'state/match';
import MatchOutline from './MatchOutline';

const getMatchInProgressChild = (
  state: MatchState
): React.ReactElement<any> => {
  // Game is running
  if (state.gameInProgress) {
    if (state.selectedMove) {
      return <div>Waiting for opponent to go</div>; // TODO
    }
    return <div>Select a move</div>; // TODO
  }

  // Game is over
  if (state.matchOutcome) {
    return <div>Match over</div>; // TODO
  }
  return <div>Game over</div>; // TODO
};

const Match: React.FC = () => {
  const { state } = useContext(MatchContext);

  // No opponent
  // if (!state.opponentName) {
  //   return <p>Waiting for opponent...</p>; // TODO
  // }

  return <MatchOutline>{getMatchInProgressChild(state)}</MatchOutline>;
};

export default Match;
