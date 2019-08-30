import { useMediaQuery, useTheme } from '@material-ui/core';

export enum ScreenSize {
  Small,
  Large,
}

/**
 * Categorizes the screen size into fewer buckets than MUI's 5 buckets.
 */
const useScreenSize = (): ScreenSize => {
  // Switch based on screen size
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('sm'))
    ? ScreenSize.Large
    : ScreenSize.Small;
};

export default useScreenSize;
