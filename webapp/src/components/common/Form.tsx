import { makeStyles } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import FlexBox from 'components/common/FlexBox';
import Paper from 'components/common/Paper';
import { noop } from 'lodash';

const useLocalStyles = makeStyles(({ spacing }) => ({
  small: { width: 300 },
  innerBox: {
    '& .MuiTextField-root': {
      width: '100%',
      marginBottom: spacing(1),
    },
  },
}));

interface Props {
  size: 'small';
  onSubmit: () => void;
}

const Form = ({
  size,
  onSubmit,
  children,
}: PropsWithChildren<Props>): React.ReactElement => {
  const localClasses = useLocalStyles();

  return (
    <Paper className={localClasses[size]}>
      <form
        onSubmit={
          onSubmit &&
          (event => {
            onSubmit();
            event.preventDefault(); // Don't reload the page
          })
        }
      >
        <FlexBox className={localClasses.innerBox} flexDirection="column">
          {children}
        </FlexBox>
      </form>
    </Paper>
  );
};

Form.defaultProps = {
  size: 'small',
  onSubmit: noop,
};

export default Form;
