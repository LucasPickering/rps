import withRouteParams from 'hoc/withRouteParams';
import useWebSocket from 'hooks/useWebSocket';
import React, { useMemo, useReducer } from 'react';
import {
  defaultMatchState,
  MatchAction,
  MatchContext,
  matchReducer,
} from 'state/match';
import ConnectionIndicator from './ConnectionIndicator';
import Match from './Match';

interface Props {
  matchId: string;
}

/**
 * Data handler for the match screen.
 */
const MatchView: React.FC<Props> = ({ matchId }) => {
  // See paragraph above for assertive programmer rant
  const [state, dispatch] = useReducer(matchReducer, defaultMatchState);
  const { status, send } = useWebSocket(
    `/ws/match/${matchId}`,
    // We need to memoize the callbacks to prevent hook triggers
    // Ugly solution but it works (sorry Seth!)
    useMemo(
      () => ({
        onMessage: event => {
          // Let's just pray our data format agrees with the API
          // TODO snake case -> camel case here
          dispatch(event.data as MatchAction);
        },
      }),
      []
    )
  );

  const contextValue = useMemo(
    () => ({
      connectionStatus: status,
      send,
      state,
    }),
    [send, state, status]
  );

  return (
    <MatchContext.Provider value={contextValue}>
      <Match />
      <ConnectionIndicator />
    </MatchContext.Provider>
  );
};

export default withRouteParams(MatchView);
