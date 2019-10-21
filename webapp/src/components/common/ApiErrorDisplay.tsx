import React from 'react';
import { Typography } from '@material-ui/core';
import ErrorSnackbar from 'components/common/ErrorSnackbar';
import useStyles from 'hooks/useStyles';
import useSplashMessage, { unknownErrorSplashes } from 'hooks/useSplashMessage';
import { ApiError } from 'state/api';

const ApiErrorDisplay = ({
  error,
  resourceName,
}: {
  error?: ApiError;
  resourceName: string;
}): React.ReactElement | null => {
  const classes = useStyles();
  const unknownErrorMsg = useSplashMessage(unknownErrorSplashes);

  if (error) {
    if (error.status === 404) {
      return (
        <Typography variant="h5" className={classes.errorMessage}>
          That {resourceName} does not exist
        </Typography>
      );
    }

    const {
      data: { detail, nonFieldErrors },
    } = error;
    const errorStr = [
      ...(detail ? [detail] : []),
      ...(nonFieldErrors || []),
    ].join('\n');
    return <ErrorSnackbar message={errorStr || unknownErrorMsg.toString()} />;
  }
  return null;
};

ApiErrorDisplay.defaultProps = {
  resourceName: 'resource',
};

export default ApiErrorDisplay;
