import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Enhanced Color Palette - Material Design 3.0 inspired
const colorPalette = {
  // Primary - Medical Blue
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Secondary - Medical Green  
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },

  // Accent - Health Orange
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },

  // Semantic Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Neutral/Gray Palette
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  }
};

// Light theme only - dark mode removed
const createAppTheme = () => {
  const mode = 'light';
  const isLight = true;
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colorPalette.primary[600],
        light: colorPalette.primary[400],
        dark: colorPalette.primary[800],
        contrastText: '#ffffff',
      },
      secondary: {
        main: colorPalette.secondary[600],
        light: colorPalette.secondary[400],
        dark: colorPalette.secondary[800],
        contrastText: '#ffffff',
      },
      accent: {
        main: colorPalette.accent[500],
        light: colorPalette.accent[300],
        dark: colorPalette.accent[700],
        contrastText: '#ffffff',
      },
      error: {
        main: colorPalette.error[500],
        light: colorPalette.error[300],
        dark: colorPalette.error[700],
      },
      warning: {
        main: colorPalette.warning[500],
        light: colorPalette.warning[300],
        dark: colorPalette.warning[700],
      },
      info: {
        main: colorPalette.info[500],
        light: colorPalette.info[300],
        dark: colorPalette.info[700],
      },
      success: {
        main: colorPalette.success[500],
        light: colorPalette.success[300],
        dark: colorPalette.success[700],
      },
      background: {
        default: isLight ? colorPalette.neutral[50] : colorPalette.neutral[900],
        paper: isLight ? '#ffffff' : colorPalette.neutral[800],
        surface: isLight ? colorPalette.neutral[100] : colorPalette.neutral[800],
        elevated: isLight ? '#ffffff' : colorPalette.neutral[700],
      },
      text: {
        primary: isLight ? colorPalette.neutral[900] : colorPalette.neutral[100],
        secondary: isLight ? colorPalette.neutral[600] : colorPalette.neutral[300],
        disabled: isLight ? colorPalette.neutral[400] : colorPalette.neutral[500],
        hint: isLight ? colorPalette.neutral[500] : colorPalette.neutral[400],
      },
      divider: isLight ? colorPalette.neutral[200] : colorPalette.neutral[700],
      action: {
        active: isLight ? colorPalette.neutral[600] : colorPalette.neutral[300],
        hover: isLight ? alpha(colorPalette.neutral[500], 0.04) : alpha(colorPalette.neutral[300], 0.08),
        selected: isLight ? alpha(colorPalette.primary[500], 0.08) : alpha(colorPalette.primary[300], 0.12),
        disabled: isLight ? colorPalette.neutral[300] : colorPalette.neutral[600],
        disabledBackground: isLight ? colorPalette.neutral[100] : colorPalette.neutral[800],
      },
      // Custom semantic colors
      medical: {
        primary: colorPalette.primary[600],
        emergency: colorPalette.error[600],
        routine: colorPalette.success[600],
        pending: colorPalette.warning[600],
        approved: colorPalette.success[600],
        rejected: colorPalette.error[600],
      }
    },
    
    typography: {
      fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica Neue", "Arial", sans-serif',
      
      // Enhanced typography scale
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.6,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.03em',
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.02em',
        textTransform: 'none',
      },
    },

    shape: {
      borderRadius: 12,
    },

    spacing: 8,

    shadows: isLight ? [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.05)',
      '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
      '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
      '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0px 35px 60px -12px rgba(0, 0, 0, 0.3)',
      ...Array(17).fill('0px 35px 60px -12px rgba(0, 0, 0, 0.3)'),
    ] : [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.3)',
      '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.24)',
      '0px 4px 6px -1px rgba(0, 0, 0, 0.4), 0px 2px 4px -1px rgba(0, 0, 0, 0.24)',
      '0px 10px 15px -3px rgba(0, 0, 0, 0.4), 0px 4px 6px -2px rgba(0, 0, 0, 0.2)',
      '0px 20px 25px -5px rgba(0, 0, 0, 0.4), 0px 10px 10px -5px rgba(0, 0, 0, 0.16)',
      '0px 25px 50px -12px rgba(0, 0, 0, 0.6)',
      '0px 35px 60px -12px rgba(0, 0, 0, 0.7)',
      ...Array(17).fill('0px 35px 60px -12px rgba(0, 0, 0, 0.7)'),
    ],

    components: {
      // Button Component
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 20px',
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: isLight 
                ? '0px 4px 12px rgba(59, 130, 246, 0.15)' 
                : '0px 4px 12px rgba(59, 130, 246, 0.3)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            boxShadow: isLight 
              ? '0px 2px 4px rgba(59, 130, 246, 0.2)' 
              : '0px 2px 4px rgba(59, 130, 246, 0.4)',
            '&:hover': {
              boxShadow: isLight 
                ? '0px 6px 16px rgba(59, 130, 246, 0.25)' 
                : '0px 6px 16px rgba(59, 130, 246, 0.5)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
              backgroundColor: alpha(colorPalette.primary[500], 0.04),
            },
          },
        },
      },

      // Card Component
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isLight 
              ? '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)' 
              : '0px 4px 6px rgba(0, 0, 0, 0.3)',
            border: isLight 
              ? `1px solid ${colorPalette.neutral[200]}` 
              : `1px solid ${colorPalette.neutral[700]}`,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isLight 
                ? '0px 4px 12px rgba(0, 0, 0, 0.15)' 
                : '0px 8px 16px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },

      // Paper Component
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: isLight 
              ? `1px solid ${colorPalette.neutral[200]}` 
              : `1px solid ${colorPalette.neutral[700]}`,
          },
          elevation1: {
            boxShadow: isLight 
              ? '0px 1px 3px rgba(0, 0, 0, 0.1)' 
              : '0px 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
      },

      // TextField Component
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colorPalette.primary[400],
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '2px',
                  borderColor: colorPalette.primary[500],
                },
              },
            },
          },
        },
      },

      // Chip Component
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },

      // Dialog Component
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: isLight 
              ? '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' 
              : '0px 25px 50px -12px rgba(0, 0, 0, 0.6)',
          },
        },
      },

      // Drawer Component
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
            borderRight: isLight 
              ? `1px solid ${colorPalette.neutral[200]}` 
              : `1px solid ${colorPalette.neutral[700]}`,
          },
        },
      },

      // AppBar Component
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: isLight 
              ? '0px 1px 3px rgba(0, 0, 0, 0.1)' 
              : '0px 2px 4px rgba(0, 0, 0, 0.3)',
            borderBottom: isLight 
              ? `1px solid ${colorPalette.neutral[200]}` 
              : `1px solid ${colorPalette.neutral[700]}`,
          },
        },
      },

      // Table Components
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isLight 
              ? `1px solid ${colorPalette.neutral[200]}` 
              : `1px solid ${colorPalette.neutral[700]}`,
          },
          head: {
            fontWeight: 600,
            backgroundColor: isLight 
              ? colorPalette.neutral[50] 
              : colorPalette.neutral[800],
          },
        },
      },

      // List Item Components
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 0',
            '&:hover': {
              backgroundColor: alpha(colorPalette.primary[500], 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(colorPalette.primary[500], 0.12),
              '&:hover': {
                backgroundColor: alpha(colorPalette.primary[500], 0.16),
              },
            },
          },
        },
      },
    },

    // Custom breakpoints
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: 1536,
      },
    },

    // Custom z-index
    zIndex: {
      drawer: 1200,
      appBar: 1100,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
  });
};

// Light theme only
const theme = createAppTheme();

export default theme;
export { colorPalette, createAppTheme };