import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Link from './Link';

const useLocalStyles = makeStyles(({ palette, spacing }) => ({
  pageFooter: {
    marginTop: 'auto',
    padding: spacing(2),
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      padding: `0px ${spacing(0.5)}px`,
    },
    '& > * + *': {
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: palette.divider,
    },
  },
}));

/**
 * Container component used to lay out a normal page. Used for most pages, but
 * not necessarily all.
 */
const PageFooter: React.FC = () => {
  const localClasses = useLocalStyles();
  return (
    <footer className={localClasses.pageFooter}>
      <Typography variant="body2">
        Created by <Link to="https://lucaspickering.me">Lucas Pickering</Link>
      </Typography>
      <Link to="https://github.com/LucasPickering/rps">GitHub</Link>
    </footer>
  );
};

export default PageFooter;
