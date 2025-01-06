import { createTheme } from '@mui/material/styles';
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) => augmentColor({ color: { main: mainColor } });

declare module '@mui/material/styles' {
  interface Palette {
    kryptonite: Palette['primary'];
  }
  interface PaletteOptions {
    kryptonite?: PaletteOptions['primary'];
  }
}

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
    kryptonite: createColor('#419844'),
  },
  typography: {
    fontFamily: ['DB Heavent', 'sans-serif'].join(','),
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          '& .MuiInputBase-input': {
            fontSize: '32px',
          }
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