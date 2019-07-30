import { Container } from '@material-ui/core';
import withRouteParams from 'hoc/withRouteParams';
import useWebSocket from 'hooks/useWebSocket';
import React, { useMemo, useReducer } from 'react';
import { defaultMatchState, MatchAction, matchReducer } from 'util/match';
import ConnectionIndicator from './ConnectionIndicator';

// A basic tenet of our match state is that it will ONLY be modified directly
// in response to a message received from the server. This (mostly) prevents us
// from ending up in a situation where our local state is de-synced from the
// server (looking at you DayZ).

interface Props {
  matchId: string;
}

const Match: React.FC<Props> = ({ matchId }) => {
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
          dispatch(event.data as MatchAction);
        },
      }),
      []
    )
  );

  return (
    <Container style={{ backgroundColor: 'red' }}>
      {matchId}
      <ConnectionIndicator status={status} />
    </Container>
  );
};

export default withRouteParams(Match);
