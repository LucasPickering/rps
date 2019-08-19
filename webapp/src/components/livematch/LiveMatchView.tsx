import camelcaseKeys from 'camelcase-keys';
import withRouteParams from 'hoc/withRouteParams';
import useWebSocket from 'hooks/useWebSocket';
import React, { useMemo, useReducer } from 'react';
import {
  LiveMatchActionType,
  LiveMatchContext,
  LiveMatchState,
  defaultLiveMatchState,
  liveMatchReducer,
} from 'state/livematch';
import ConnectionIndicator from './ConnectionIndicator';
import LiveMatch from './LiveMatch';

interface Props {
  matchId: string;
}

/**
 * Data handler for the match screen.
 */
const LiveMatchView: React.FC<Props> = ({ matchId }) => {
  const [state, dispatch] = useReducer(liveMatchReducer, defaultLiveMatchState);
  const { status, send } = useWebSocket(
    `/ws/match/${matchId}`,
    // We need to memoize the callbacks to prevent hook triggers
    // Ugly solution but it works (sorry Seth!)
    useMemo(
      () => ({
        onMessage: data => {
          if (data.error) {
            console.error('Socket error:', data); // TODO
          } else {
            // Let's just pray our data format agrees with the API
            dispatch({
              type: LiveMatchActionType.MatchUpdate,
              state: (camelcaseKeys(data, {
                deep: true,
              }) as unknown) as LiveMatchState,
            });
          }
        },
      }),
      []
    )
  );

  const contextValue = useMemo(
    () => ({
      connectionStatus: status,
      sendMessage: send,
      state,
    }),
    [send, state, status]
  );

  return (
    <LiveMatchContext.Provider value={contextValue}>
      <LiveMatch />
      <ConnectionIndicator />
    </LiveMatchContext.Provider>
  );
};

export default withRouteParams(LiveMatchView);
