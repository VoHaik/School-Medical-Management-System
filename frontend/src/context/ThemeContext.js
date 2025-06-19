import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for user preference on initial load
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  // Update localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#6c63ff' : '#4f46e5',
      },
      background: {
        default: darkMode ? '#18191a' : '#f4f6fa',
        paper: darkMode ? '#23272f' : '#fff',
      },
      card: {
        main: darkMode ? '#23272f' : '#fff',
      },
      text: {
        primary: darkMode ? '#e4e6eb' : '#222',
        secondary: darkMode ? '#b0b3b8' : '#555',
        disabled: darkMode ? '#8b949e' : '#b0b3b8',
      },
      divider: darkMode ? 'rgba(255,255,255,0.08)' : '#e0e0e0',
      action: {
        hover: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        selected: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: Array(25).fill('none').map((_, i) =>
      i === 1
        ? darkMode
          ? '0 2px 8px 0 rgba(0,0,0,0.45)'
          : '0 2px 8px 0 rgba(76, 78, 100, 0.1)'
        : 'none'
    ),
    transitions: {
      // transition cho background, color
      create: (props = [], options = {}) => {
        const properties = Array.isArray(props) ? props : [props];
        return properties.map(prop => `${prop} 0.4s`).join(', ');
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};