import camelcaseKeys from 'camelcase-keys';
import withRouteParams from 'hoc/withRouteParams';
import useWebSocket from 'hooks/useWebSocket';
import React, { useMemo, useReducer } from 'react';
import {
  defaultMatchState,
  MatchActionType,
  MatchContext,
  matchReducer,
  MatchState,
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
  const [state, dispatch] = useReducer(matchReducer, defaultMatchState);
  const { status, send } = useWebSocket(
    `/ws/match/${matchId}`,
    // We need to memoize the callbacks to prevent hook triggers
    // Ugly solution but it works (sorry Seth!)
    useMemo(
      () => ({
        onMessage: data => {
          if (data.error) {
            console.error(`Socket error:`, data);
          } else {
            // Let's just pray our data format agrees with the API
            // TODO use io-ts here
            const matchAction = {
              type: MatchActionType.MatchUpdate,
              state: (camelcaseKeys(data, {
                deep: true,
              }) as unknown) as MatchState,
            };
            dispatch(matchAction);
          }
        },
      }),
      []
    )
  );

  const contextValue = useMemo(
    () => ({
      connectionStatus: status,
      sendMessage: send, // TODO camel=>snake here
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
