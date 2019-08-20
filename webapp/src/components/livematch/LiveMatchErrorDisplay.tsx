import React from 'react';
import { LiveMatchError, LiveMatchErrorType } from 'state/livematch';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import routes from 'util/routes';

const LiveMatchErrorDisplay: React.FC<{ error?: LiveMatchError }> = ({
  error,
}) => {
  if (error) {
    const { type, detail } = error;
    switch (type) {
      case LiveMatchErrorType.NotLoggedIn:
        return (
          <Typography>
            You have to <Link to={routes.login.build({}, {})}>Log In</Link> to
            play a match.
          </Typography>
        );
      default:
        return (
          <Typography>
            Error {type}: {detail}
          </Typography>
        );
    }
  }
  return null;
};

export default LiveMatchErrorDisplay;
