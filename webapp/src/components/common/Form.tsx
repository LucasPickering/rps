import { makeStyles } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import FlexBox from 'components/common/FlexBox';
import Paper from 'components/common/Paper';
import { noop } from 'lodash';
import clsx from 'clsx';

const useLocalStyles = makeStyles(({ spacing }) => ({
  formPaper: {
    alignSelf: 'center',
  },
  small: { width: 200 },
  medium: { width: 300 },
  innerBox: {
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface Props {
  className?: string;
  size: 'small' | 'medium';
  onSubmit: () => void;
}

const Form = ({
  className,
  size,
  onSubmit,
  children,
}: PropsWithChildren<Props>): React.ReactElement => {
  const localClasses = useLocalStyles();

  return (
    <Paper
      className={clsx(localClasses.formPaper, localClasses[size], className)}
    >
      <form
        onSubmit={
          onSubmit &&
          (event => {
            onSubmit();
            event.preventDefault(); // Don't reload the page
          })
        }
      >
        <FlexBox
          className={localClasses.innerBox}
          flexDirection="column"
          alignItems="left"
        >
          {children}
        </FlexBox>
      </form>
    </Paper>
  );
};

Form.defaultProps = {
  size: 'medium',
  onSubmit: noop,
};

export default Form;
