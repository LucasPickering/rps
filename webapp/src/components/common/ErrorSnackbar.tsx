import React, { useState } from 'react';
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

const ErrorSnackbar = ({
  message,
  ...rest
}: {
  message: string;
} & Omit<
  React.ComponentProps<typeof Snackbar>,
  'open'
>): React.ReactElement => {
  const localClasses = useLocalStyles();
  const [open, setOpen] = useState(true);
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={() => setOpen(false)}
      {...rest}
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
