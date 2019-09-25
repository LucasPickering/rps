import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import NavLink from 'components/common/NavLink';

const useLocalStyles = makeStyles(({ palette, typography }) => ({
  link: {
    height: 48, // 100% doesn't work on chrome for some reason
    backgroundColor: palette.grey[900],
    color: palette.text.primary,
    width: 80,
    ...typography.body1,
    '&:hover, &:active': {
      backgroundColor: palette.action.hover,
      textDecoration: 'none',
    },
  },
  active: {
    backgroundColor: palette.action.selected,
    textDecoration: 'none',
  },
}));

const HeaderLink: React.FC<React.ComponentProps<typeof NavLink>> = ({
  className,
  ...rest
}) => {
  // const linkClasses = useLinkStyles();
  const localClasses = useLocalStyles();
  return (
    <NavLink
      className={clsx(localClasses.link, className)}
      activeClassName={localClasses.active}
      {...rest}
    />
  );
};

export default HeaderLink;
