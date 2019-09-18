import { useCallback, useEffect, useRef, useState } from 'react';
import useSafeCallbacks from './useSafeCallbacks';
import useIsMounted from './useIsMounted';
import camelcaseKeys from 'camelcase-keys';

const RECONNECT_TIMEOUT = 5000;

export type Send = (data: unknown) => void;
type EventConsumer<T = Event> = (event: T) => void;
interface MessageData {
  [key: string]: unknown;
}

interface WebSocketCallbacks {
  onOpen?: EventConsumer;
  onMessage?: EventConsumer<MessageData>;
  onError?: EventConsumer;
  onClose?: EventConsumer<CloseEvent>;
}

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'closedError'
  | 'closedNormal';

/**
 * Hook for managing a websocket.
 */
const useWebSocket = (
  addr: string,
  callbacks: WebSocketCallbacks,
  dependencies: readonly unknown[] = []
): { status: ConnectionStatus; send: Send } => {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const wsRef = useRef<WebSocket | undefined>();
  const reconnectTimeoutIdRef = useRef<number | undefined>();

  // Memoized send function
  const send = useCallback<Send>((data: unknown) => {
    const { current: ws } = wsRef;
    if (ws) {
      ws.send(JSON.stringify(data));
    } else {
      throw new Error('send called while websocket is closed');
    }
  }, []);

  // Prevent updates after unmounting
  const isMounted = useIsMounted();

  const { onOpen, onMessage, onError, onClose } = useSafeCallbacks<
    WebSocketCallbacks
  >(callbacks);

  /**
   * A function to establish a WS connection
   */
  const connect: React.EffectCallback = () => {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const fullAddr = `${protocol}://${window.location.host}${addr}`;
    wsRef.current = new WebSocket(fullAddr);

    const { current: ws } = wsRef;
    wsRef.current.onopen = event => {
      if (isMounted.current) {
        setStatus('connected');
        if (onOpen) {
          onOpen(event);
        }
      }
    };
    ws.onmessage = event => {
      if (isMounted.current && onMessage) {
        // This is probably safe, right?
        const camelData = (camelcaseKeys(JSON.parse(event.data), {
          deep: true,
        }) as unknown) as MessageData;
        onMessage(camelData);
      }
    };
    ws.onerror = event => {
      if (isMounted.current) {
        if (onError) {
          onError(event);
        }
      }
    };

    ws.onclose = event => {
      if (isMounted.current) {
        // code === 1000 indicates normal closure
        if (event.code === 1000) {
          setStatus('closedNormal');
        } else {
          setStatus('closedError');
          // Reconnect after a certain amount of time
          reconnectTimeoutIdRef.current = window.setTimeout(() => {
            connect();
          }, RECONNECT_TIMEOUT);
        }

        if (onClose) {
          onClose(event);
        }
      }
    };

    // Close the socket on unmount
    return () => {
      window.clearTimeout(reconnectTimeoutIdRef.current);
      ws.close();
    };
  };

  useEffect(connect, [
    addr,
    onOpen,
    onMessage,
    onError,
    onClose,
    isMounted,
    ...dependencies, // eslint-disable-line react-hooks/exhaustive-deps
  ]);

  return { status, send };
};

export default useWebSocket;
