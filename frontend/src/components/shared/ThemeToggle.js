import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  useTheme,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Brightness6 as AutoModeIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = ({ 
  variant = 'icon', // 'icon' | 'button' | 'switch'
  showLabel = false,
  size = 'medium',
  ...props 
}) => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeMode();

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      default:
        return <AutoModeIcon />;
    }
  };

  const getTooltip = () => {
    switch (mode) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to light mode';
      default:
        return 'Switch theme mode';
    }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 0.8, opacity: 0 },
    animate: { 
      rotate: 0, 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      }
    },
    exit: { 
      rotate: 180, 
      scale: 0.8, 
      opacity: 0,
      transition: {
        duration: 0.2,
      }
    },
  };

  if (variant === 'icon') {
    return (
      <Tooltip title={getTooltip()} arrow>
        <IconButton
          onClick={toggleColorMode}
          size={size}
          sx={{
            color: theme.palette.text.primary,
            borderRadius: 2,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
          {...props}
        >
          <Box
            component={motion.div}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getIcon()}
              </motion.div>
            </AnimatePresence>
          </Box>
        </IconButton>
      </Tooltip>
    );
  }

  // Add other variants later if needed
  return null;
};

export default ThemeToggle;
