import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import RootRoutes from './routes/RootRoutes';
import HeaderBar from './HeaderBar';
import useUser from 'hooks/useUser';

const useLocalStyles = makeStyles(({ spacing }) => ({
  root: {
    // minWidth: 360,
    // minHeight: 640,
    height: '100%',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(4),
  },
}));

/**
 * Container for all content on the page.
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
      <RootRoutes />
    </div>
  );
};

export default PageContainer;
