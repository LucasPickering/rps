import { makeStyles, Container, Grid } from '@material-ui/core';
import React from 'react';
import RootRoutes from './routes/RootRoutes';

const useLocalStyles = makeStyles(({ spacing }) => ({
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
      <Grid container direction="column" alignItems="center" spacing={2}>
        <RootRoutes />
      </Grid>
    </Container>
  );
};

export default PageContainer;
