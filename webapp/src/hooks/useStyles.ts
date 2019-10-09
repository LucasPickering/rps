import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  pageTitle: {
    ...typography.h3,
  },
  pageSubtitle: {
    ...typography.h5,
  },
  panelTitle: {
    ...typography.h6,
  },
  caption: {
    ...typography.body1,
  },
  errorMessage: {
    marginTop: spacing(1),
    color: palette.error.main,
  },
}));

export default useStyles;
