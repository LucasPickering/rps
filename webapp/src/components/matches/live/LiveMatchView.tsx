import React, { useReducer, useCallback, useEffect, useState } from 'react';
import withRouteParams from 'hoc/withRouteParams';

import {
  Typography,
  LinearProgress,
  makeStyles,
  Modal,
  Button,
} from '@material-ui/core';
import useGetRequest from 'hooks/useGetRequest';
import {
  LiveMatchMetadata,
  liveMatchReducer,
  defaultLiveMatchState,
  LiveMatchActionType,
  LiveMatchError,
  LiveMatchData,
  ClientMessageType,
  LiveMatchMetadataContext,
  LiveMatchDataContext,
  LiveMatchSendMessageContext,
} from 'state/livematch';
import useStyles from 'hooks/useStyles';
import useWebSocket, { EventConsumer, MessageData } from 'hooks/useWebSocket';
import LiveMatch from './LiveMatch';
import ConnectionIndicator from './ConnectionIndicator';
import PageLayout from 'components/common/PageLayout';
import LiveMatchErrorDisplay from './LiveMatchErrorDisplay';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import useUser from 'hooks/useUser';
import Form from 'components/common/Form';

const useLocalStyles = makeStyles(() => ({
  loading: {
    width: '100%',
  },
  joinModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
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

  const { user } = useUser();
  const {
    loading: metadataLoading,
    data: metadata,
    error: metadataError,
  } = useGetRequest<LiveMatchMetadata>(`/api/matches/live/${matchId}/`);
  const [state, dispatch] = useReducer(liveMatchReducer, defaultLiveMatchState);

  // Used to track if the play/spectate modal has been shown already
  const [joinModalShown, setJoinModalShown] = useState(false);

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
      onMessage: useCallback<EventConsumer<MessageData>>((send, data) => {
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

  // Can this use join the game as a participant? Will be true if they are
  // already participating
  const canParticipate = Boolean(
    user && state.data && state.data.players.length < 2
  );
  const isParticipant = Boolean(state.data && state.data.isParticipant);

  // Set up an interval to ping the server
  useEffect(() => {
    if (status === 'connected' && isParticipant) {
      const intervalId = setInterval(
        () => send({ type: ClientMessageType.Heartbeat }),
        5000
      );
      return () => clearInterval(intervalId);
    }
  }, [status, send, isParticipant]);

  const getContent = (): React.ReactElement => {
    if (metadataLoading || status === 'connecting') {
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
      return <ApiErrorDisplay resourceName="match" error={metadataError} />;
    }

    if (metadata && state.data) {
      return (
        // This is broken into 3 contexts to compartmentalize re-renders
        <LiveMatchMetadataContext.Provider value={metadata}>
          <LiveMatchDataContext.Provider value={state.data}>
            <LiveMatchSendMessageContext.Provider value={send}>
              <LiveMatch />
            </LiveMatchSendMessageContext.Provider>
          </LiveMatchDataContext.Provider>
        </LiveMatchMetadataContext.Provider>
      );
    }

    return <></>; // Shouldn't ever get here
  };

  const closeJoinModal = useCallback(() => setJoinModalShown(true), [
    setJoinModalShown,
  ]);
  // The div in the Modal is the easiest way to fix a ref error from react
  return (
    <PageLayout maxWidth="lg">
      {getContent()}
      <Modal
        open={Boolean(canParticipate && !isParticipant && !joinModalShown)}
      >
        <div>
          <Form className={localClasses.joinModal} size="small">
            <Button variant="outlined" onClick={closeJoinModal}>
              Spectate
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Join the match as a participant
                send({ type: ClientMessageType.Join });
                closeJoinModal();
              }}
            >
              Play
            </Button>
          </Form>
        </div>
      </Modal>
      <ConnectionIndicator connectionStatus={status} />
      <LiveMatchErrorDisplay errors={state.errors} />
    </PageLayout>
  );
};

export default withRouteParams(LiveMatchView);
