import React from 'react';
import { LiveMatchError } from 'state/livematch';
import { Snackbar, SnackbarContent, makeStyles, Box } from '@material-ui/core';
import { Error as IconError } from '@material-ui/icons';

const useLocalStyles = makeStyles(({ spacing, palette }) => ({
  snackbarContent: {
    backgroundColor: palette.error.main,
  },
  icon: {
    marginRight: spacing(1),
  },
}));

const LiveMatchErrorDisplay: React.FC<{ errors: LiveMatchError[] }> = ({
  errors,
}) => {
  const localClasses = useLocalStyles();
  return (
    <>
      {errors.map(error => (
        <Snackbar
          key={error.error}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <SnackbarContent
            className={localClasses.snackbarContent}
            message={
              <Box display="flex" flexDirection="row" alignItems="center">
                <IconError className={localClasses.icon} />
                {error.error}: {error.detail}
              </Box>
            }
          />
        </Snackbar>
      ))}
    </>
  );
};

export default LiveMatchErrorDisplay;
