import queryString from 'query-string';
import React, { PropsWithChildren } from 'react';
import { useLocation, Redirect } from 'react-router';
import { Container, makeStyles, CircularProgress } from '@material-ui/core';
import { sizeMq } from 'util/styles';
import useUser from 'hooks/useUser';
import usePathAsQuery from 'hooks/usePathAsQuery';

const useLocalStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,

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
  restriction?: 'loggedIn' | 'notLoggedIn';
}

/**
 * Container component used to lay out a normal page. Used for most pages, but
 * not necessarily all.
 */
const PageLayout = ({
  maxWidth,
  restriction,
  children,
}: PropsWithChildren<Props>): React.ReactElement => {
  const localClasses = useLocalStyles();
  const { loading: userLoading, user } = useUser();
  const { search } = useLocation();
  const nextQuery = usePathAsQuery();

  // Check if we need to render anything related to route restrictions. If so,
  // this content will override the children
  const restrictionContent = (() => {
    // If the user is not logged in but this page should only be shown to
    // logged-in users, redirect to the login page (with next= param)
    if (restriction === 'loggedIn' && !user) {
      return userLoading ? (
        <CircularProgress />
      ) : (
        <Redirect to={`/account/login${nextQuery}`} />
      );
    }

    // If this page should only be shown to not-logged-in users and the user is
    // logged in, redirect to another page based on the next= param
    if (restriction === 'notLoggedIn' && user) {
      const { next } = queryString.parse(search);
      const nextString = (Array.isArray(next) ? next[0] : next) || '';
      // This will default to the home page if next= is empty
      return <Redirect to={nextString} />;
    }
  })();

  return (
    <Container className={localClasses.root} maxWidth={maxWidth}>
      {restrictionContent || children}
    </Container>
  );
};

PageLayout.defaultProps = {
  maxWidth: 'sm',
};

export default PageLayout;
