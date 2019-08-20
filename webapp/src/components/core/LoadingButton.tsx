import {
  makeStyles,
  Button as MuiButton,
  CircularProgress,
} from '@material-ui/core';
import React from 'react';

const useLocalStyles = makeStyles(() => ({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

interface Props {
  loading: boolean;
}

const LoadingButton: React.FC<
  Props & React.ComponentProps<typeof MuiButton>
> & {
  defaultProps: Partial<Props>;
} = ({ loading, color, disabled, children, ...rest }) => {
  const localClasses = useLocalStyles();
  return (
    <MuiButton disabled={disabled || loading} {...rest}>
      {children}
      {loading && (
        <CircularProgress
          className={localClasses.loading}
          color={color === 'default' ? 'inherit' : color}
          size={24}
        />
      )}
    </MuiButton>
  );
};

LoadingButton.defaultProps = {
  loading: false,
};

export default LoadingButton;
