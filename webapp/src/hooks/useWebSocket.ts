import { useCallback, useEffect, useRef, useState } from 'react';
import useSafeCallbacks from './useSafeCallbacks';

export type Send = (data: unknown) => void;
type EventConsumer<T = Event> = (event: T) => void;

interface WebSocketCallbacks {
  onOpen?: EventConsumer;
  onMessage?: EventConsumer<{ [key: string]: unknown }>;
  onError?: EventConsumer;
  onClose?: EventConsumer<CloseEvent>;
}

export enum ConnectionStatus {
  Connecting,
  Connected,
  ClosedError,
  ClosedNormal,
}

/**
 * Hook for managing a websocket.
 */
const useWebSocket = (
  addr: string,
  callbacks: WebSocketCallbacks
): { status: ConnectionStatus; send: Send } => {
  const [status, setStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Connecting
  );
  const wsRef = useRef<WebSocket | undefined>(undefined);

  // Memoized send function
  const send = useCallback<Send>((data: unknown) => {
    const { current: ws } = wsRef;
    if (ws) {
      ws.send(JSON.stringify(data));
    } else {
      console.error('send called while websocket is closed');
    }
  }, []);

  const { onOpen, onMessage, onError, onClose } = useSafeCallbacks<
    WebSocketCallbacks
  >(callbacks);

  useEffect(() => {
    const protocol = window.location.protocol === 'https' ? 'wss' : 'ws';
    wsRef.current = new WebSocket(
      `${protocol}://${window.location.host}${addr}`
    );
    const { current: ws } = wsRef;

    wsRef.current.onopen = event => {
      setStatus(ConnectionStatus.Connected);
      if (onOpen) {
        onOpen(event);
      }
    };
    ws.onmessage = event => {
      if (onMessage) {
        onMessage(JSON.parse(event.data));
      }
    };
    ws.onerror = event => {
      console.error('Socket error: ', event);
      if (onError) {
        onError(event);
      }
    };

    ws.onclose = event => {
      // code === 1000 indicates normal closure
      setStatus(
        event.code === 1000
          ? ConnectionStatus.ClosedNormal
          : ConnectionStatus.ClosedError
      );
      if (onClose) {
        onClose(event);
      }
    };

    // Close the socket on unmount
    return () => {
      ws.close();
    };
  }, [addr, onOpen, onMessage, onError, onClose]);

  return { status, send };
};

export default useWebSocket;
