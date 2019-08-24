import { useCallback } from 'react';

const TIMEOUT = 3000;

type Notify = (text: string) => void;

interface Options {
  skipIfFocused: boolean;
}

const defaultOptions: Options = {
  skipIfFocused: true,
};

/**
 * Hook to handle access to the browser Notifications API
 */
const useNotifications = (options: Partial<Options> = {}): Notify => {
  const { skipIfFocused } = {
    ...defaultOptions,
    ...options,
  };

  // Ask for permission
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  return useCallback(
    (text: string) => {
      if (
        Notification.permission === 'granted' &&
        !(document.hasFocus() && skipIfFocused)
      ) {
        const notification = new Notification('RPS', {
          body: text,
          image: '/favicon.ico',
        });
        setTimeout(notification.close.bind(notification), TIMEOUT);
      }
    },
    [skipIfFocused]
  );
};

export default useNotifications;
