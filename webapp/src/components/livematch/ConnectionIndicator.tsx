import {
  Chip,
  CircularProgress,
  makeStyles,
  Popover,
  Theme,
} from '@material-ui/core';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@material-ui/icons';
import classNames from 'classnames';
import useSplashMessage, {
  connectionStatusSplasher,
} from 'hooks/useSplashMessage';
import { ConnectionStatus } from 'hooks/useWebSocket';
import React, { useContext, useState } from 'react';
import { LiveMatchContext } from 'state/livematch';

const statusLabels = {
  [ConnectionStatus.Connecting]: 'Connecting',
  [ConnectionStatus.Connected]: 'Connected',
  [ConnectionStatus.ClosedNormal]: 'Closed',
  [ConnectionStatus.ClosedError]: 'Error',
};

const useLocalStyles = makeStyles(({ palette, spacing }: Theme) => ({
  root: {
    position: 'absolute',
    bottom: spacing(2),
    left: spacing(2),
  },
  success: {
    backgroundColor: palette.primary.main,
  },
  error: {
    backgroundColor: palette.error.main,
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverPaper: {
    padding: spacing(1),
  },
}));

const StatusIcon: React.FC<{ status: ConnectionStatus }> = ({
  status,
  ...rest
}) => {
  switch (status) {
    case ConnectionStatus.Connecting:
      // TODO fix sizing here
      return <CircularProgress size={16} color="secondary" {...rest} />;
    case ConnectionStatus.Connected:
      return <CheckCircleIcon {...rest} />;
    case ConnectionStatus.ClosedNormal:
      return <CancelIcon {...rest} />;
    case ConnectionStatus.ClosedError:
      return <ErrorIcon {...rest} />;
  }
};

const ConnectionIndicator: React.FC = () => {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<
    HTMLElement | undefined
  >(undefined);
  const { connectionStatus } = useContext(LiveMatchContext);
  const localClasses = useLocalStyles();

  const splashMessage = useSplashMessage(
    connectionStatusSplasher,
    connectionStatus
  );
  const popoverOpen = Boolean(popoverAnchorEl && splashMessage);

  return (
    <div>
      <Chip
        className={classNames(localClasses.root, {
          [localClasses.success]:
            connectionStatus === ConnectionStatus.Connected,
          [localClasses.error]:
            connectionStatus === ConnectionStatus.ClosedError,
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
