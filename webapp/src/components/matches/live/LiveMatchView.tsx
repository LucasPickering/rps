import React, { useReducer, useCallback, useEffect } from 'react';
import withRouteParams from 'hoc/withRouteParams';

import { Typography, LinearProgress, makeStyles } from '@material-ui/core';
import useFetch from 'hooks/useFetch';
import {
  LiveMatchConfig,
  liveMatchReducer,
  defaultLiveMatchState,
  LiveMatchActionType,
  LiveMatchError,
  LiveMatchData,
  ClientMessageType,
  LiveMatchContext,
} from 'state/livematch';
import useStyles from 'hooks/useStyles';
import useWebSocket from 'hooks/useWebSocket';
import { ConnectionStatus } from 'hooks/useSafeCallbacks';
import LiveMatch from './LiveMatch';
import ConnectionIndicator from './ConnectionIndicator';

const useLocalStyles = makeStyles(() => ({
  loading: {
    width: '100%',
  },
}));

/**
 * Handles the /match/live/<matchId> route, NOT including /match/live/new. This
 * will fetch the match config from the API, and establish a websocket
 * connection to participate in/spectate the match.
 */
const LiveMatchView: React.FC<{
  matchId: string;
}> = ({ matchId }) => {
  const classes = useStyles();
  const localClasses = useLocalStyles();

  const { loading: configLoading, data: config, error: configError } = useFetch<
    LiveMatchConfig
  >(`/api/matches/live/${matchId}/`);
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

  const getContent = (): React.ReactElement => {
    if (configLoading || status === ConnectionStatus.Connecting) {
      return (
        <>
          <Typography className={classes.normalMessage}>
            Connecting to server...
          </Typography>
          <LinearProgress className={localClasses.loading} />
        </>
      );
    }

    if (configError) {
      return (
        <Typography>
          {configError.status === 404 ? 'Match not found' : 'An error occurred'}
        </Typography>
      );
    }

    if (config) {
      return (
        <LiveMatchContext.Provider
          value={{
            sendMessage: send,
            config,
            state,
          }}
        >
          <LiveMatch />
        </LiveMatchContext.Provider>
      );
    }

    return <></>; // Shouldn't ever get here
  };

  return (
    <>
      {getContent()}
      <ConnectionIndicator connectionStatus={status} />
    </>
  );
};

export default withRouteParams(LiveMatchView);
