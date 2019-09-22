import React, { PropsWithChildren } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { sizeMq } from 'util/styles';

const useLocalStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',

    // Top-level loading icons generally should be centered
    '& > .MuiCircularProgress-root': {
      alignSelf: 'center',
    },
    [sizeMq('small', breakpoints)]: {
      padding: spacing(2),
    },
    [sizeMq('large', breakpoints)]: {
      padding: spacing(4),
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
