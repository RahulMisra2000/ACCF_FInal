import { createMuiTheme, responsiveFontSizes, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

// responsiveFontSizes makes the text inside the Typography component responsive
const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: colors.indigo[800]
    },
    secondary: {
      main: colors.indigo[500]
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows,
  typography
}));

export default theme;
