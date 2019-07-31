import { Chip, CircularProgress, makeStyles, Theme } from '@material-ui/core';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@material-ui/icons';
import classNames from 'classnames';
import { ConnectionStatus } from 'hooks/useWebSocket';
import React, { useContext } from 'react';
import { MatchContext } from 'state/match';

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
}));

const getStatusIcon = (status: ConnectionStatus): React.ReactElement<any> => {
  switch (status) {
    case ConnectionStatus.Connecting:
      // TODO fix sizing here
      return <CircularProgress size={16} color="secondary" />;
    case ConnectionStatus.Connected:
      return <CheckCircleIcon />;
    case ConnectionStatus.ClosedNormal:
      return <CancelIcon />;
    case ConnectionStatus.ClosedError:
      return <ErrorIcon />;
  }
};

const ConnectionIndicator: React.FC = () => {
  const { connectionStatus } = useContext(MatchContext);
  const localClasses = useLocalStyles();
  return (
    <Chip
      className={classNames(localClasses.root, {
        [localClasses.success]: connectionStatus === ConnectionStatus.Connected,
        [localClasses.error]: connectionStatus === ConnectionStatus.ClosedError,
      })}
      icon={getStatusIcon(connectionStatus)}
      label={statusLabels[connectionStatus]}
    />
  );
};

export default ConnectionIndicator;
