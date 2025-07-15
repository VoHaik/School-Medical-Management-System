// NOTE VN: Component DarkModeToggle - Toggle dark/light mode
// - Sử dụng ThemeContext để quản lý theme state
// - Material-UI IconButton với tooltip
// - Responsive icons cho light/dark modes
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tooltip from '@mui/material/Tooltip';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    // NOTE VN: Tooltip để hiển thị hướng dẫn cho user
    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleDarkMode}
        color="inherit"
        aria-label="toggle dark mode" // NOTE VN: Accessibility support
        className="dark-mode-toggle"
      >
        {/* NOTE VN: Conditional rendering icon dựa trên current mode */}
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

// NOTE VN: Export DarkModeToggle component
// CHỨC NĂNG CHÍNH:
// 1. Theme switching functionality
// 2. Context-based state management
// 3. Accessible toggle button với tooltip
// 4. Material-UI icon integration
// 5. Visual feedback cho current theme state

export default DarkModeToggle;