import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tooltip from '@mui/material/Tooltip';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleDarkMode}
        color="inherit"
        aria-label="toggle dark mode"
        className="dark-mode-toggle"
        sx={{ transition: 'color 0.4s' }}
      >
        {darkMode ? <Brightness7Icon sx={{ transition: 'color 0.4s' }} /> : <Brightness4Icon sx={{ transition: 'color 0.4s' }} />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;