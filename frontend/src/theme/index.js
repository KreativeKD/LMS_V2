/**
 * Theme System
 * Centralized design tokens for the entire application
 * Use these constants for consistency across all components
 */

// ===== SPACING SCALE (8px base) =====
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
};

// ===== TYPOGRAPHY SCALE =====
export const typography = {
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
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
    fontSize: '1.1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  bodyLarge: {
    fontSize: '1.05rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  bodySmall: {
    fontSize: '0.95rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  small: {
    fontSize: '0.85rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  xsmall: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
};

// ===== COLOR PALETTE =====
export const colors = {
  // Primary branding
  primary: '#10b981',
  primaryDark: '#059669',
  primaryLight: '#34d399',
  
  // Accent/Secondary
  accent: '#4f46e5',
  accentLight: '#818cf8',
  
  // Semantic colors
  success: '#10b981',
  successLight: '#86efac',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  danger: '#ef4444',
  dangerLight: '#fca5a5',
  info: '#3b82f6',
  infoLight: '#93c5fd',
  
  // Backgrounds
  background: '#ffffff',
  surface: '#f9fafb',
  surfaceAlt: '#f3f4f6',
  surfaceHover: '#f3f4f6',
  surfaceDisabled: '#e5e7eb',
  
  // Text
  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textInverse: '#ffffff',
  
  // Borders
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#d1d5db',
  
  // Glass/Overlay
  glass: 'rgba(0, 0, 0, 0.05)',
  glassLight: 'rgba(0, 0, 0, 0.02)',
  skeleton: 'linear-gradient(90deg, #e5e7eb 0%, #f8fafc 42%, #e5e7eb 78%)',
  
  // Gradients
  gradient: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
  gradientHover: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
};

// ===== BORDER RADIUS =====
export const borderRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

// ===== SHADOWS =====
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

// ===== TRANSITIONS =====
export const transitions = {
  xs: '75ms ease',
  sm: '150ms ease',
  md: '200ms ease',
  lg: '300ms ease',
  xl: '500ms ease',
};

// ===== Z-INDEX SCALE =====
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1010,
  fixed: 1020,
  modal: 1030,
  popover: 1032,
  tooltip: 1070,
};

// ===== BREAKPOINTS =====
export const breakpoints = {
  xs: '0px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  '2xl': '1536px',
};

// ===== HELPER FUNCTION =====
export const media = {
  mobile: '@media (max-width: 480px)',
  tablet: '@media (max-width: 768px)',
  laptop: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
};

export default {
  spacing,
  typography,
  colors,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  media,
};
