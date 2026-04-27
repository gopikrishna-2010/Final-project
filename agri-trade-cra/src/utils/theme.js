// src/utils/theme.js
import { createTheme } from '@mui/material/styles'

const baseColors = {
  primary: '#1b4332',     // Deep Forest Green
  primaryLight: '#2d6a4f',
  primaryDark: '#081c15',
  secondary: '#d4a373',   // Warm Earthy Sand
  secondaryLight: '#faedcd',
  accent: '#d97706',      // Sunset Orange for CTA (High-contrast)
  backgroundLight: '#ffffff', // Pure White for Sunlight visibility
  surface: '#f8f9fa',
  muted: '#495057'
}

export default function getAppTheme(mode = 'light') {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: baseColors.primary,
        light: baseColors.primaryLight,
        dark: baseColors.primaryDark,
        contrastText: '#ffffff'
      },
      secondary: {
        main: baseColors.secondary,
        light: baseColors.secondaryLight,
        contrastText: '#1b4332'
      },
      background: {
        default: isDark ? '#0b1612' : baseColors.backgroundLight,
        paper: isDark ? '#14201c' : '#ffffff'
      },
      text: {
        primary: isDark ? '#f8f9fa' : '#1b4332',
        secondary: isDark ? '#adb5bd' : '#2d3436'
      },
      success: { main: '#40916c' },
      warning: { main: baseColors.accent },
      info: { main: '#2a6f97' },
      divider: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    },

    shape: { borderRadius: 12 },

    typography: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      h1: { fontWeight: 900, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, letterSpacing: '-0.01em' },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600, lineHeight: 1.5 },
      body1: { fontSize: '1.1rem', lineHeight: 1.6, color: isDark ? '#f8f9fa' : '#1b4332' },
      body2: { fontSize: '1rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 700, fontSize: '1rem' }
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark ? '#0b1612' : '#ffffff',
            borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: 'none'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            padding: '12px 28px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transform: 'scale(1.02)'
            }
          },
          containedPrimary: {
            background: baseColors.primary,
            '&:hover': {
              background: baseColors.primaryLight
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: baseColors.primary,
              backgroundColor: isDark ? 'rgba(45, 106, 79, 0.05)' : 'rgba(45, 106, 79, 0.02)'
            }
          }
        }
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 20
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            padding: 16
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 16,
              backgroundColor: '#f8f9fa',
              '& fieldset': {
                borderWidth: 2
              },
              '&:hover fieldset': {
                borderColor: baseColors.primaryLight
              }
            }
          }
        }
      }
    }
  })
}
