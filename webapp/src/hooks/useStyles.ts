import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing }) => ({
  errorMessage: {
    marginTop: spacing(1),
    color: palette.error.main,
  },
}));

export default useStyles;
