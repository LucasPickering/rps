import { noop } from 'lodash';
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
  // SOME BROWSERS (*cough* safari on iOS *cough*) don't support Notifications
  const isSupported = 'Notification' in window;
  const { skipIfFocused } = {
    ...defaultOptions,
    ...options,
  };

  // Ask for permission
  if (isSupported && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  return useCallback(
    isSupported
      ? (text: string) => {
          if (
            Notification.permission === 'granted' &&
            !(document.hasFocus() && skipIfFocused)
          ) {
            const notification = new Notification('RPS', {
              body: text,
              icon: '/favicon.ico',
            });
            setTimeout(notification.close.bind(notification), TIMEOUT);
          }
        }
      : noop,
    [isSupported, skipIfFocused]
  );
};

export default useNotifications;
