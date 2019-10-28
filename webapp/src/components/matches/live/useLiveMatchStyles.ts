import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ typography }) => ({
  normalMessage: typography.h5,
  majorMessage: typography.h3,
  caption: typography.body1,
}));

export default useStyles;
