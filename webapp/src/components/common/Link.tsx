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
    display: 'inline-flex',
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
  to,
  ...rest
}) => {
  const localClasses = useLinkStyles();
  return to.toString().match(/^https?:/) ? (
    <a
      className={clsx(localClasses.link, className)}
      href={to.toString()}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    />
  ) : (
    <RouterLink
      className={clsx(localClasses.link, className)}
      to={to}
      {...rest}
    />
  );
};

export default Link;
