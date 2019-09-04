import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  minorMessage: {
    ...typography.body1,
  },
  normalMessage: {
    ...typography.h5,
  },
  majorMessage: {
    ...typography.h3,
  },
  errorMessage: {
    marginTop: spacing(1),
    color: palette.error.main,
  },
}));

export default useStyles;
