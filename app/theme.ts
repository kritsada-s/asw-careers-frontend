import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'DB Heavent, sans-serif',
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
    button: {
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
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'DB Heavent';
          src: url('/fonts/DBHeavent-Regular.woff2') format('woff2'),
               url('/fonts/DBHeavent-Regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'DB Heavent';
          src: url('/fonts/DBHeavent-Bold.woff2') format('woff2'),
               url('/fonts/DBHeavent-Bold.woff') format('woff');
          font-weight: bold;
          font-style: normal;
        }
      `,
    },
  },
});

export default theme;