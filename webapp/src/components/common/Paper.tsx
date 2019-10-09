import { makeStyles, Paper as MuiPaper } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useLocalStyles = makeStyles(({ spacing }) => ({
  paper: {
    padding: spacing(2),
  },
}));

const Paper: React.FC<React.ComponentProps<typeof MuiPaper>> = ({
  className,
  ...rest
}) => {
  const localClasses = useLocalStyles();
  return <MuiPaper className={clsx(localClasses.paper, className)} {...rest} />;
};

export default Paper;
