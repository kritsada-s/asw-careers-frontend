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
    h1: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '52px',
      fontWeight: 'bold'
    },
    h2: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '48px',
      fontWeight: 'bold'
    },
    h3: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '40px',
      fontWeight: 'bold',
      '@media (max-width:480px)': {
        fontSize: '30px',
      },
    },
    h4: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '32px',
      fontWeight: 'bold'
    },
    h5: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '30px',
      fontWeight: 500
    },
    h6: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '28px',
      fontWeight: 500
    },
    button: {
      fontFamily: 'DB Heavent, sans-serif',
    },
    body1: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '22px'
    },
    body2: {
      fontFamily: 'DB Heavent, sans-serif',
      fontSize: '18px'
    },
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