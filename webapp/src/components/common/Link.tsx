import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

/**
 * Exported for NavLink
 */
export const useLinkStyles = makeStyles(({ palette }) => ({
  link: {
    // For links with icons
    display: 'flex',
    alignItems: 'center',

    color: palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '& > button': {
      textDecoration: 'none',
    },
  },
}));

const Link: React.FC<React.ComponentProps<typeof RouterLink>> = ({
  className,
  ...rest
}) => {
  const localClasses = useLinkStyles();
  return (
    <RouterLink className={clsx(localClasses.link, className)} {...rest} />
  );
};

export default Link;
