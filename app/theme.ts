import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#123F6D',
      light: '#123F6D',
      dark: '#123F6D',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F1683B',
      light: '#F1683B',
      dark: '#F1683B',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'DB Heavent, sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          backgroundColor: '#FFFFFF'
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        }
      }
    }
  },
});

export default theme;