import React from 'react';
import { Snackbar, SnackbarContent, makeStyles } from '@material-ui/core';
import { Error as IconError } from '@material-ui/icons';
import FlexBox from 'components/common/FlexBox';

const useLocalStyles = makeStyles(({ spacing, palette }) => ({
  snackbarContent: {
    backgroundColor: palette.error.main,
    color: palette.error.contrastText,
  },
  icon: {
    marginRight: spacing(1),
  },
}));

const ErrorSnackbar: React.FC<{ message: string }> = ({ message }) => {
  const localClasses = useLocalStyles();
  return (
    <Snackbar
      open
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <SnackbarContent
        className={localClasses.snackbarContent}
        message={
          <FlexBox flexDirection="row">
            <IconError className={localClasses.icon} />
            {message}
          </FlexBox>
        }
      />
    </Snackbar>
  );
};

export default ErrorSnackbar;
