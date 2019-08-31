import useWebSocket, { ConnectionStatus } from 'hooks/useWebSocket';
import React, { useReducer, useCallback, useEffect } from 'react';
import {
  LiveMatchActionType,
  LiveMatchContext,
  liveMatchReducer,
  LiveMatchData,
  LiveMatchError,
  defaultLiveMatchState,
  ClientMessageType,
} from 'state/livematch';
import ConnectionIndicator from './ConnectionIndicator';
import LiveMatch from './LiveMatch';
import { Typography, LinearProgress, makeStyles } from '@material-ui/core';
import useStyles from 'hooks/useStyles';

const useLocalStyles = makeStyles(() => ({
  loading: {
    width: '100%',
  },
}));

/**
 * Data handler for the match screen. Establishes a websocket connection, and
 * as long as that connection is open, renders a {@link LiveMatch}.
 */
const LiveMatchHandler: React.FC<{
  matchId: string;
}> = ({ matchId }) => {
  const classes = useStyles();
  const localClasses = useLocalStyles();
  const [state, dispatch] = useReducer(liveMatchReducer, defaultLiveMatchState);
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
            data: (data as unknown) as LiveMatchData,
          });
        }
      }, []),
    }
  );

  // Set up an interval to ping the server once per second
  useEffect(() => {
    if (status === ConnectionStatus.Connected) {
      const intervalId = setInterval(
        () => send({ type: ClientMessageType.Heartbeat }),
        1000
      );
      return () => clearInterval(intervalId);
    }
  }, [status, send]);

  const getContent = (): React.ReactElement | undefined => {
    switch (status) {
      case ConnectionStatus.Connecting:
        return (
          <>
            <Typography className={classes.normalMessage}>
              Connecting to server...
            </Typography>
            <LinearProgress className={localClasses.loading} />
          </>
        );
      case ConnectionStatus.Connected:
        return (
          <LiveMatchContext.Provider
            value={{
              sendMessage: send,
              state,
            }}
          >
            <LiveMatch />
          </LiveMatchContext.Provider>
        );
      default:
        return undefined;
    }
  };

  return (
    <>
      {getContent()}
      <ConnectionIndicator connectionStatus={status} />
    </>
  );
};

export default LiveMatchHandler;
