import { useEffect, useState } from 'react';

type Send = (data: any) => void;
type EventConsumer<T = Event> = (event: T, send: Send) => void;

/**
 * Hook for managing a websocket.
 */
export default (
  addr: string,
  {
    onOpen,
    onMessage,
    onError,
    onClose,
  }: {
    onOpen?: EventConsumer;
    onMessage?: EventConsumer<MessageEvent>;
    onError?: EventConsumer;
    onClose?: EventConsumer;
  }
): [boolean, Send?] => {
  const [send, setSend] = useState<Send | undefined>(undefined);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}${addr}`);
    const innerSend = (data: any) => ws.send(JSON.stringify(data));

    ws.onopen = event => {
      setSend(innerSend);
      if (onOpen) {
        onOpen(event, innerSend);
      }
    };

    if (onMessage) {
      ws.onmessage = event => {
        onMessage(event, innerSend);
      };
    }
    if (onError) {
      ws.onerror = event => {
        onError(event, innerSend);
      };
    }

    ws.onclose = event => {
      setSend(undefined);
      if (onClose) {
        onClose(event, innerSend);
      }
    };

    // Close the socket on unmount
    return () => {
      ws.close();
    };
  }, [addr, onOpen, onMessage, onError, onClose, send]);

  return [send !== undefined, send];
};
