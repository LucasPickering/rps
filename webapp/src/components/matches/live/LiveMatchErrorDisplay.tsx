import React from 'react';
import { LiveMatchError } from 'state/livematch';
import ErrorSnackbar from 'components/common/ErrorSnackbar';

const LiveMatchErrorDisplay: React.FC<{ errors: LiveMatchError[] }> = ({
  errors,
}) => {
  return (
    <>
      {errors.map(error => (
        <ErrorSnackbar
          key={error.error}
          message={`${error.error}: ${error.detail}`}
          autoHideDuration={3000}
        />
      ))}
    </>
  );
};

export default LiveMatchErrorDisplay;
