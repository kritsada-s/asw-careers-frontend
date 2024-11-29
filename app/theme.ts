import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#123F6D',
      light: '#2A527C',
      dark: '#0e355e',
      contrastText: '#ffffff',
    }
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