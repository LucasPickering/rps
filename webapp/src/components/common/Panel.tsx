import { makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useLocalStyles = makeStyles(({ spacing }) => ({
  paper: {
    padding: spacing(2),
  },
}));

interface Props {
  title?: React.ReactNode;
}

const Panel = ({
  className,
  title,
  children,
  ...rest
}: React.ComponentProps<typeof Paper> & Props): React.ReactElement => {
  const localClasses = useLocalStyles();
  return (
    <Paper className={clsx(localClasses.paper, className)} {...rest}>
      {title && <Typography variant="h6">{title}</Typography>}
      {children}
    </Paper>
  );
};

export default Panel;
