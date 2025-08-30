import { createTheme } from '@mui/material/styles';

// Basic Material Design theme. Customize as needed.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#fff',
      paper: '#ffffff',
    },
  },
  typography: {
    // Use Noto Sans JP provided via next/font variable
    fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
  },
});

export default theme;
