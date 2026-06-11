const fs = require('fs');

// Fix theme/index.js
let theme = fs.readFileSync('frontend/src/theme/index.js', 'utf8');
const start = theme.indexOf('export const colors = {');
const end = theme.indexOf('};\n', start) + 3;

const newColors = `export const colors = {
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
  background: 'var(--background, #ffffff)',
  surface: 'var(--card-bg, #f9fafb)',
  surfaceAlt: 'var(--skeleton-base, #f3f4f6)',
  surfaceHover: 'var(--skeleton-highlight, #f3f4f6)',
  surfaceDisabled: 'var(--skeleton-base, #e5e7eb)',
  
  // Text
  text: 'var(--text-main, #111827)',
  textSecondary: 'var(--text-muted, #6b7280)',
  textMuted: 'var(--text-muted, #9ca3af)',
  textInverse: '#ffffff',
  
  // Borders
  border: 'var(--border, #e5e7eb)',
  borderLight: 'var(--glass, #f3f4f6)',
  borderDark: 'var(--border, #d1d5db)',
  
  // Glass/Overlay
  glass: 'var(--glass, rgba(0, 0, 0, 0.05))',
  glassLight: 'var(--glass, rgba(0, 0, 0, 0.02))',
  skeleton: 'linear-gradient(90deg, var(--skeleton-base) 0%, var(--skeleton-highlight) 42%, var(--skeleton-base) 78%)',
  
  // Gradients
  gradient: 'var(--text-gradient, linear-gradient(135deg, #4f46e5 0%, #4338ca 100%))',
  gradientHover: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
};
`;

theme = theme.substring(0, start) + newColors + theme.substring(end);
fs.writeFileSync('frontend/src/theme/index.js', theme);

// Fix StudentCourseView.jsx
let view = fs.readFileSync('frontend/src/pages/StudentCourseView.jsx', 'utf8');
view = view.replace(
  /cursor: unitHidden \? "default" : "pointer",\s*fontSize: "14px",\s*\w*\}\}/g,
  'cursor: unitHidden ? "default" : "pointer",\n                                fontSize: "14px",\n                                color: colors.text,\n                              }}'
);
fs.writeFileSync('frontend/src/pages/StudentCourseView.jsx', view);

console.log('Fixed');
