import React, { useReducer, useCallback, useEffect } from 'react';
import withRouteParams from 'hoc/withRouteParams';

import { Typography, LinearProgress, makeStyles } from '@material-ui/core';
import useFetch from 'hooks/useFetch';
import {
  LiveMatchMetadata,
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
import PageLayout from 'components/common/PageLayout';
import LiveMatchErrorDisplay from './LiveMatchErrorDisplay';

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

  const {
    loading: metadataLoading,
    data: metadata,
    error: metadataError,
  } = useFetch<LiveMatchMetadata>(`/api/matches/live/${matchId}/`);
  const [state, dispatch] = useReducer(liveMatchReducer, defaultLiveMatchState);
  // Reset state when the match ID changes. Prevents weird flickering when
  // starting a rematch.
  useEffect(() => () => dispatch({ type: LiveMatchActionType.Reset }), [
    matchId,
  ]);
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
    },
    [matchId] // Create a new socket when the match ID changes
  );

  // Set up an interval to ping the server once per second
  const isParticipant = Boolean(state.data && state.data.isParticipant);
  useEffect(() => {
    if (status === ConnectionStatus.Connected && isParticipant) {
      const intervalId = setInterval(
        () => send({ type: ClientMessageType.Heartbeat }),
        3000
      );
      return () => clearInterval(intervalId);
    }
  }, [status, send, isParticipant]);

  const getContent = (): React.ReactElement => {
    if (metadataLoading || status === ConnectionStatus.Connecting) {
      return (
        <>
          <Typography className={classes.normalMessage}>
            Connecting to server...
          </Typography>
          <LinearProgress className={localClasses.loading} />
        </>
      );
    }

    if (metadataError) {
      return (
        <Typography>
          {metadataError.status === 404
            ? 'Match not found'
            : 'An error occurred'}
        </Typography>
      );
    }

    if (metadata && state.data) {
      return (
        <LiveMatchContext.Provider
          value={{
            sendMessage: send,
            metadata,
            data: state.data,
          }}
        >
          <LiveMatch />
        </LiveMatchContext.Provider>
      );
    }

    return <></>; // Shouldn't ever get here
  };

  return (
    <PageLayout maxWidth="lg">
      {getContent()}
      <ConnectionIndicator connectionStatus={status} />
      <LiveMatchErrorDisplay errors={state.errors} />
    </PageLayout>
  );
};

export default withRouteParams(LiveMatchView);
