import { useCallback, useEffect, useRef, useState } from 'react';

type Send = (data: any) => void;
type EventConsumer<T = Event> = (event: T) => void;
interface Callbacks {
  onOpen?: EventConsumer;
  onMessage?: EventConsumer<MessageEvent>;
  onError?: EventConsumer;
  onClose?: EventConsumer;
}

/**
 * Hook for managing a websocket.
 */
export default (
  addr: string,
  callbacks: Callbacks
): { isOpen: boolean; send: Send } => {
  const [isOpen, setIsOpen] = useState(false);
  const wsRef = useRef<WebSocket | undefined>(undefined);

  // Memoized send function
  const send = useCallback<Send>((data: any) => {
    const { current: ws } = wsRef;
    if (ws) {
      ws.send(JSON.stringify(data));
    } else {
      // tslint:disable-next-line no-console
      console.error('send called while websocket is closed');
    }
  }, []);

  // Safety check to make sure callbacks doesn't change
  // Prevents unintended triggers on the useEffect hook
  const callbacksRef = useRef<Callbacks>(callbacks);
  if (callbacks !== callbacksRef.current) {
    throw new Error('The callbacks object changed. You broke the rules!');
  }

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://${window.location.host}${addr}`);
    const { current: ws } = wsRef;

    wsRef.current.onopen = event => {
      setIsOpen(true);
      if (callbacks.onOpen) {
        callbacks.onOpen(event);
      }
    };
    ws.onmessage = event => {
      if (callbacks.onMessage) {
        callbacks.onMessage(event);
      }
    };
    ws.onerror = event => {
      // tslint:disable-next-line no-console
      console.error('Socket error: ', event);
      if (callbacks.onError) {
        callbacks.onError(event);
      }
    };

    ws.onclose = event => {
      setIsOpen(false);
      if (callbacks.onClose) {
        callbacks.onClose(event);
      }
    };

    // Close the socket on unmount
    return () => {
      ws.close();
    };
  }, [addr, callbacks]);

  return { isOpen, send };
};
