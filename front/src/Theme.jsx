import { createTheme } from '@mui/material/styles';
import '@fontsource/libre-baskerville';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7E4F00',
      light: '#975F00',
      contrastText: '#C4C4C4',
    },
    secondary: {
      main: '#A4AC86',
      contrastText: '#000000',
    },
    neutral: {
      main: '#C4C4C4',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: `"Libre Baskerville", serif`,
  },
});

export default theme;