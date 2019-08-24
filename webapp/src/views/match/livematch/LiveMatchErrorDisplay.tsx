import React from 'react';
import { LiveMatchError } from 'state/livematch';
import { Snackbar, SnackbarContent, makeStyles } from '@material-ui/core';
import { Error as IconError } from '@material-ui/icons';
import FlexBox from 'components/core/FlexBox';

const useLocalStyles = makeStyles(({ spacing, palette }) => ({
  snackbarContent: {
    backgroundColor: palette.error.main,
    color: palette.error.contrastText,
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
              <FlexBox flexDirection="row">
                <IconError className={localClasses.icon} />
                {error.error}: {error.detail}
              </FlexBox>
            }
          />
        </Snackbar>
      ))}
    </>
  );
};

export default LiveMatchErrorDisplay;
