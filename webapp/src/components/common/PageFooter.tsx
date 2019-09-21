import React from 'react';
import { makeStyles } from '@material-ui/core';
import Link from './Link';

const useLocalStyles = makeStyles(({ spacing }) => ({
  root: {
    marginTop: 'auto',
    padding: spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

/**
 * Container component used to lay out a normal page. Used for most pages, but
 * not necessarily all.
 */
const PageFooter: React.FC = () => {
  const localClasses = useLocalStyles();
  return (
    <footer className={localClasses.root}>
      <Link to="https://github.com/LucasPickering/rps">GitHub</Link>
    </footer>
  );
};

export default PageFooter;
