'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Sacred golden MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#fff',
    },
    secondary: {
      main: '#c0392b',
      light: '#e74c3c',
      dark: '#922b21',
      contrastText: '#fff',
    },
    background: {
      default: '#faf6ef',
      paper: '#ffffff',
    },
    text: {
      primary: '#3d1a00',
      secondary: '#78350f',
    },
  },
  typography: {
    fontFamily: "'Lato', sans-serif",
    h1: { fontFamily: "'Cinzel Decorative', serif", fontWeight: 700 },
    h2: { fontFamily: "'Cinzel', serif", fontWeight: 700 },
    h3: { fontFamily: "'Cinzel', serif", fontWeight: 600 },
    h4: { fontFamily: "'Cinzel', serif", fontWeight: 600 },
    h5: { fontFamily: "'Cinzel', serif", fontWeight: 500 },
    h6: { fontFamily: "'Cinzel', serif", fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: "'Cinzel', serif",
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#f59e0b',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f59e0b',
            },
          },
          '& label.Mui-focused': {
            color: '#d97706',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(180, 83, 9, 0.08)',
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
