import React, { PropsWithChildren } from 'react';
import { Container, makeStyles } from '@material-ui/core';

const useLocalStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(4),
    // Top-level loading icons generally should be centered
    '& > .MuiCircularProgress-root': {
      alignSelf: 'center',
    },
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
  return (
    <Container className={localClasses.root} maxWidth={maxWidth}>
      {children}
    </Container>
  );
};

PageLayout.defaultProps = {
  maxWidth: 'sm',
};

export default PageLayout;
