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
    allVariants: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    h1: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    h2: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    h3: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    h4: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    h5: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    h6: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    body1: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    body2: {
      fontFamily: 'DB Heavent, sans-serif',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          backgroundColor: '#FFFFFF',
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
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF'
        }
      }
    }
  },
});

export default theme;