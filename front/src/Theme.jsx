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
  },
  typography: {
    fontFamily: `"Libre Baskerville", serif`,
    fontSize: 14,
  },
});

export default theme;