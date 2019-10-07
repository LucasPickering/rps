import { Theme, createMuiTheme } from '@material-ui/core';
import createPalette, {
  Palette,
  PaletteColor,
  PaletteOptions,
  PaletteColorOptions,
} from '@material-ui/core/styles/createPalette';
import { lightBlue, lightGreen } from '@material-ui/core/colors';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

interface CustomPalette extends Palette {
  success: PaletteColor;
}

interface CustomPaletteOptions extends PaletteOptions {
  success: PaletteColorOptions;
}

// https://material-ui.com/guides/typescript/#customization-of-theme
declare module '@material-ui/core/styles/createMuiTheme' {
  // Add an extra field to allow for custom additional colors
  interface Theme {
    customPalette: CustomPalette;
  }
  interface ThemeOptions {
    customPalette?: CustomPaletteOptions;
  }
}

const createCustomTheme = (options: ThemeOptions): Theme =>
  createMuiTheme({
    ...options,
    customPalette: {
      // Hack to re-use MUI's logic for generating a palette color
      // This will need to be refactored to add more custom colors
      success: createPalette({
        secondary: (options.customPalette || {}).success,
      }).secondary,
    },
  });

const theme: Theme = createCustomTheme({
  palette: {
    type: 'dark',
    primary: lightBlue,
    secondary: lightGreen,
  },
  customPalette: {
    success: lightGreen,
  },
});

export default theme;
