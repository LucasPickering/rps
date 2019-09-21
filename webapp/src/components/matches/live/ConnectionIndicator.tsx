import { Chip, CircularProgress, makeStyles, Popover } from '@material-ui/core';
import {
  Cancel as IconCancel,
  CheckCircle as IconCheckCircle,
  Error as IconError,
} from '@material-ui/icons';
import clsx from 'clsx';
import useSplashMessage, {
  connectionStatusSplasher,
} from 'hooks/useSplashMessage';
import { ConnectionStatus } from 'hooks/useWebSocket';
import React, { useState } from 'react';
import useScreenSize from 'hooks/useScreenSize';

const statusLabels = {
  connecting: 'Connecting',
  connected: 'Connected',
  closedNormal: 'Closed',
  closedError: 'Error',
};

const useLocalStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    position: 'absolute',
    bottom: spacing(2),
    left: spacing(2),
  },
  success: {
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,
  },
  error: {
    backgroundColor: palette.error.main,
    color: palette.error.contrastText,
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverPaper: {
    padding: spacing(1),
  },
  small: {
    '& > .MuiChip-label': {
      visibility: 'hidden',
      width: 0,
      paddingRight: 0,
    },
  },
}));

const StatusIcon: React.FC<{ status: ConnectionStatus }> = ({
  status,
  ...rest
}) => {
  switch (status) {
    case 'connecting':
      // TODO fix sizing here
      return <CircularProgress size={16} {...rest} />;
    case 'connected':
      return <IconCheckCircle {...rest} />;
    case 'closedNormal':
      return <IconCancel {...rest} />;
    case 'closedError':
      return <IconError {...rest} />;
  }
};

const ConnectionIndicator: React.FC<{ connectionStatus: ConnectionStatus }> = ({
  connectionStatus,
}) => {
  const localClasses = useLocalStyles();
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<
    HTMLElement | undefined
  >(undefined);
  const screenSize = useScreenSize();
  const splashMessage = useSplashMessage(
    connectionStatusSplasher,
    connectionStatus
  );

  const popoverOpen = Boolean(popoverAnchorEl && splashMessage);

  return (
    <div>
      <Chip
        className={clsx(localClasses.root, {
          [localClasses.success]: connectionStatus === 'connected',
          [localClasses.error]: connectionStatus === 'closedError',
          [localClasses.small]: screenSize === 'small',
        })}
        icon={<StatusIcon status={connectionStatus} />}
        label={statusLabels[connectionStatus]}
        onMouseEnter={e => setPopoverAnchorEl(e.currentTarget)}
        onMouseLeave={() => setPopoverAnchorEl(undefined)}
        aria-owns={popoverOpen ? 'connection-status-popover' : undefined}
        aria-haspopup="true"
      />
      <Popover
        id="connection-status-popover"
        className={localClasses.popover}
        classes={{
          paper: localClasses.popoverPaper,
        }}
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setPopoverAnchorEl(undefined)}
        disableRestoreFocus
      >
        {splashMessage}
      </Popover>
    </div>
  );
};

export default ConnectionIndicator;
