import React, { PropsWithChildren } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import useScreenSize from 'hooks/useScreenSize';
import clsx from 'clsx';

const useLocalStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',

    // Top-level loading icons generally should be centered
    '& > .MuiCircularProgress-root': {
      alignSelf: 'center',
    },
  },
  small: {
    padding: spacing(2),
  },
  large: {
    padding: spacing(4),
  },
}));

interface Props {
  maxWidth: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Container component used to lay out a normal page. Used for most pages, but
 * not necessarily all.
 */
const PageLayout = ({
  maxWidth,
  children,
}: PropsWithChildren<Props>): React.ReactElement => {
  const localClasses = useLocalStyles();
  const screenSize = useScreenSize();
  return (
    <Container
      className={clsx(localClasses.root, localClasses[screenSize])}
      maxWidth={maxWidth}
    >
      {children}
    </Container>
  );
};

PageLayout.defaultProps = {
  maxWidth: 'sm',
};

export default PageLayout;
