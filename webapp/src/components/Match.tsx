import withRouteParams from 'hoc/withRouteParams';
import useWebSocket from 'hooks/useWebSocket';
import React, { useMemo, useReducer } from 'react';
import { defaultMatchState, MatchAction, matchReducer } from 'util/match';

interface Props {
  matchId: string;
}

const Match: React.FC<Props> = ({ matchId }) => {
  const [state, dispatch] = useReducer(matchReducer, defaultMatchState);
  const { isOpen, send } = useWebSocket(
    `/ws/match/${matchId}`,
    // We need to memoize the callbacks to prevent hook triggers
    // Ugly solution but it works (sorry Seth!)
    useMemo(
      () => ({
        onMessage: event => {
          // Let's just pray our data format agrees with the API
          dispatch(event.data as MatchAction);
        },
        onClose: event => {
          console.log('closed!');
        },
      }),
      []
    )
  );

  return (
    <div>
      {matchId} - WS: {isOpen ? 'Open' : 'Closed'}
    </div>
  );
};

export default withRouteParams(Match);
