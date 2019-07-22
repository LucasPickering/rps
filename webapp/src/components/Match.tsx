import withRouteParams from 'hoc/withRouteParams';
import React, { useEffect, useState } from 'react';

interface Props {
  matchId: string;
}

const Match: React.FC<Props> = ({ matchId }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const ws = new WebSocket(
      `ws://${window.location.host}/ws/match/${matchId}`
    );
    ws.onopen = () => {
      console.log('open');
      ws.send(JSON.stringify({ message: 'asdf' }));
      setIsOpen(true);
    };
    ws.onmessage = event => {
      console.log('Received: ', event.data);
    };
  }, [matchId]);

  return <div>{matchId}</div>;
};

export default withRouteParams(Match);
