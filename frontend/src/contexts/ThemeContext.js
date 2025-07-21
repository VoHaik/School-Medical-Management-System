import React, { createContext, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';

// Create Theme Context
const ThemeContext = createContext();

// Custom hook to use theme context
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component - light mode only
export const AppThemeProvider = ({ children }) => {
  // Always use light mode
  const mode = 'light';

  // Disabled functions for dark mode
  const toggleColorMode = () => {
    // Dark mode functionality removed
  };

  const setColorMode = () => {
    // Dark mode functionality removed
  };

  // Create theme based on light mode only
  const theme = createAppTheme();

  // Context value
  const contextValue = {
    mode,
    toggleColorMode,
    setColorMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
