'use'
import { createTheme, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const getCssVar = (name: string) => undefined
  // getComputedStyle(document.documentElement).getPropertyValue(name).trim();


const theme = createTheme({
  palette: {
    primary: {
      main: getCssVar('--primary') || '#6366F1',
      contrastText: getCssVar('--primary-foreground') || '#fff',
    },
    secondary: {
      main: getCssVar('--secondary') || '#F87171',
      contrastText: getCssVar('--secondary-foreground') || '#000',
    },
    background: {
      default: getCssVar('--background') || '#fff',
      paper: getCssVar('--card') || '#f8f8f8',
    },
    text: {
      primary: getCssVar('--foreground') || '#111',
      secondary: getCssVar('--muted-foreground') || '#888',
    },
  },
  typography: {
    fontFamily: 'var(--font-sans)',
  },
  shape: {
    borderRadius: 'var(--radius)',
  },
  components: {
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          color: 'var(--primary)',
          '&.Mui-checked': {
            color: 'var(--primary)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'var(--border)',
        },
      },
    },
  },
});

export const WithThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);