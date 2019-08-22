import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ typography }) => ({
  minorMessage: {
    ...typography.body1,
  },
  normalMessage: {
    ...typography.h5,
  },
  majorMessage: {
    ...typography.h3,
  },
}));

export default useStyles;
