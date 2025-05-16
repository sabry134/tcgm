import { createTheme } from '@mui/material/styles';
import '@fontsource/libre-baskerville';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7E4F00',
      dark: '#653F00',
      light: '#975F00',
      contrastText: '#C4C4C4',
    },
    secondary: {
      main: '#002F7E',
      dark: '#002665',
      light: '#003897',
      contrastText: '#C4C4C4',
    },
    neutral: {
      main: '#C4C4C4',
      dark: '#AFAFAF',
      light: '#E0E0E0',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: `"Libre Baskerville", serif`,
  },
});

export default theme;