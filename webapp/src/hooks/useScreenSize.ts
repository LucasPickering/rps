import { useMediaQuery, useTheme } from '@material-ui/core';

export type ScreenSize = 'small' | 'large';

/**
 * Categorizes the screen size into fewer buckets than MUI's 5 buckets.
 */
const useScreenSize = (): ScreenSize => {
  // Switch based on screen size
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('sm')) ? 'large' : 'small';
};

export default useScreenSize;
