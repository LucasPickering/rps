import { makeStyles } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import FlexBox from 'components/common/FlexBox';
import Panel from 'components/common/Panel';
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
  title,
  size,
  onSubmit,
  children,
}: PropsWithChildren<
  Props & Pick<React.ComponentProps<typeof Panel>, 'title'>
>): React.ReactElement => {
  const localClasses = useLocalStyles();

  return (
    <Panel
      className={clsx(localClasses.formPaper, localClasses[size], className)}
      title={title}
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
    </Panel>
  );
};

Form.defaultProps = {
  size: 'medium',
  onSubmit: noop,
};

export default Form;
