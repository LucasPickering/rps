import { Theme, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import RootRoutes from './routes/RootRoutes';

const useLocalStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(4),
  },
}));

/**
 * Container for all content below the header.
 */
const PageContainer: React.FC = () => {
  const localClasses = useLocalStyles();

  return (
    <Container className={localClasses.root}>
      <RootRoutes />
    </Container>
  );
};

export default PageContainer;
