import React, { createContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always use light theme
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4f46e5',
      },
      secondary: {
        main: '#10b981',
      },
      // Other theme settings
    },
  });

  return (
    <ThemeContext.Provider value={{}}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};