import queryString from 'query-string';
import React, { PropsWithChildren } from 'react';
import { useLocation, Redirect } from 'react-router';
import {
  Typography,
  Container,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import { sizeMq } from 'util/styles';
import useUser from 'hooks/useUser';
import { makeLoginRoute } from 'util/routes';

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
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  restriction?: 'loggedIn' | 'notLoggedIn';
}

const PageContent = ({
  title,
  subtitle,
  restriction,
  children,
}: PropsWithChildren<Omit<Props, 'maxWidth'>>): React.ReactElement => {
  const { loading: userLoading, user } = useUser();
  const location = useLocation();

  // Check if we need to render anything related to route restrictions. If so,
  // this content will override the children

  // If the user is not logged in but this page should only be shown to
  // logged-in users, redirect to the login page (with next= param)
  if (restriction === 'loggedIn' && !user) {
    return userLoading ? (
      <CircularProgress />
    ) : (
      <Redirect to={makeLoginRoute(location)} />
    );
  }

  // If this page should only be shown to not-logged-in users and the user is
  // logged in, redirect to another page based on the next= param
  if (restriction === 'notLoggedIn' && user) {
    const { next } = queryString.parse(location.search);
    const nextString = (Array.isArray(next) ? next[0] : next) || '';
    // This will default to the home page if next= is empty
    return <Redirect to={nextString} />;
  }

  // User has correct login state, render the normal content
  return (
    <>
      {title && <Typography variant="h3">{title}</Typography>}
      {subtitle && <Typography variant="h5">{subtitle}</Typography>}
      {children}
    </>
  );
};

/**
 * Container component used to lay out a normal page. Used for most pages, but
 * not necessarily all.
 */
const PageLayout = ({
  maxWidth,
  ...rest
}: PropsWithChildren<Props>): React.ReactElement => {
  const localClasses = useLocalStyles();

  return (
    <Container className={localClasses.root} maxWidth={maxWidth}>
      <PageContent {...rest} />
    </Container>
  );
};

PageLayout.defaultProps = {
  maxWidth: 'sm',
};

export default PageLayout;
