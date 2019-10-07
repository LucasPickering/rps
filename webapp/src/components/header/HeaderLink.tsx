import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import NavLink from 'components/common/NavLink';

const useLocalStyles = makeStyles(({ palette, typography }) => {
  const activeStyles = {
    textDecoration: 'none',
    borderBottomColor: palette.primary.main,
  };
  return {
    linkContainer: {
      minWidth: 80,
      textAlign: 'center',
    },
    link: {
      color: palette.text.primary,
      borderBottom: '1px solid #00000000',
      transitionProperty: 'border-bottom, color',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'linear',
      ...typography.body1,

      '&:hover, &:active': {
        ...activeStyles,
        color: palette.text.hint,
      },
    },
    active: activeStyles,
  };
});

const HeaderLink: React.FC<React.ComponentProps<typeof NavLink>> = ({
  className,
  ...rest
}) => {
  // const linkClasses = useLinkStyles();
  const localClasses = useLocalStyles();
  return (
    <span className={localClasses.linkContainer}>
      <NavLink
        className={clsx(localClasses.link, className)}
        activeClassName={localClasses.active}
        {...rest}
      />
    </span>
  );
};

export default HeaderLink;
