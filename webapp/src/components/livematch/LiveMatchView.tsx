import camelcaseKeys from 'camelcase-keys';
import withRouteParams from 'hoc/withRouteParams';
import useWebSocket from 'hooks/useWebSocket';
import React, { useMemo, useReducer, useCallback } from 'react';
import {
  LiveMatchActionType,
  LiveMatchContext,
  liveMatchReducer,
  LiveMatchStateData,
  LiveMatchError,
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
  const [state, dispatch] = useReducer(liveMatchReducer, {});
  const { status, send } = useWebSocket(
    `/ws/match/${matchId}`,
    // We need to memoize the callbacks to prevent hook triggers
    // Ugly solution but it works (sorry Seth!)
    {
      onMessage: useCallback(data => {
        if (data.error) {
          dispatch({
            type: LiveMatchActionType.Error,
            error: (data as unknown) as LiveMatchError,
          });
        } else {
          // Let's just pray our data format agrees with the API
          dispatch({
            type: LiveMatchActionType.MatchUpdate,
            data: (camelcaseKeys(data, {
              deep: true,
            }) as unknown) as LiveMatchStateData,
          });
        }
      }, []),
    }
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
