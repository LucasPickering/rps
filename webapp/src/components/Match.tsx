import withRouteParams from 'hoc/withRouteParams';
import useSocket from 'hooks/useSocket';
import React, { useReducer } from 'react';
import { defaultMatchState, MatchAction, matchReducer } from 'state/match';

interface Props {
  matchId: string;
}

const Match: React.FC<Props> = ({ matchId }) => {
  const [state, dispatch] = useReducer(matchReducer, defaultMatchState);
  const [isOpen, send] = useSocket(`/ws/match/${matchId}`, {
    onMessage: event => {
      // Let's just pray our data format agrees with the API
      dispatch(event.data as MatchAction);
    },
    onError: event => {
      console.error('Socket error: ', event);
    },
  });

  return (
    <div>
      {matchId} - WS: {isOpen ? 'Open' : 'Closed'}
    </div>
  );
};

export default withRouteParams(Match);
