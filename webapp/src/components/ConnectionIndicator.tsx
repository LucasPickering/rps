import {
  Chip,
  CircularProgress,
  Icon,
  makeStyles,
  Theme,
} from '@material-ui/core';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@material-ui/icons';
import classNames from 'classnames';
import { ConnectionStatus } from 'hooks/useWebSocket';
import React from 'react';

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

interface Props {
  status: ConnectionStatus;
}

const ConnectionIndicator: React.FC<Props> = ({ status }) => {
  const localClasses = useLocalStyles();
  return (
    <Chip
      className={classNames(localClasses.root, {
        [localClasses.success]: status === ConnectionStatus.Connected,
        [localClasses.error]: status === ConnectionStatus.ClosedError,
      })}
      icon={getStatusIcon(status)}
      label={statusLabels[status]}
    />
  );
};

export default ConnectionIndicator;
