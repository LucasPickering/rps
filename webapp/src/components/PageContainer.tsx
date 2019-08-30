import { makeStyles, Container, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import RootRoutes from './routes/RootRoutes';
import HeaderBar from './HeaderBar';
import useUser from 'hooks/useUser';

const useLocalStyles = makeStyles(({ spacing }) => ({
  root: {
    minWidth: 360,
    minHeight: 640,
  },
  body: {
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
  const { requestUser } = useUser();

  // On first load, fetch user data
  useEffect(() => requestUser(), [requestUser]);

  // Only render the page if user data is loaded
  return (
    <div className={localClasses.root}>
      <HeaderBar />
      <Container className={localClasses.body}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <RootRoutes />
        </Grid>
      </Container>
    </div>
  );
};

export default PageContainer;
