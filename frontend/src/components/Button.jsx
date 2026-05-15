import React from 'react';
import { spacing, typography, colors, borderRadius, transitions } from '../theme';

/**
 * Button Component
 * Unified button component with multiple variants, sizes, and states
 * 
 * Variants: primary, secondary, danger, success, warning, ghost
 * Sizes: sm, md, lg
 * States: loading, disabled
 * 
 * Usage:
 * <Button variant="primary" size="md" onClick={handler}>Click Me</Button>
 * <Button variant="danger" loading={isLoading}>Delete</Button>
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  className = '',
  style = {},
  type = 'button',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: {
      background: colors.gradient,
      color: colors.textInverse,
      border: 'none',
      hover: {
        background: colors.gradientHover,
        boxShadow: `0 8px 16px rgba(79, 70, 229, 0.3)`,
      },
      active: {
        transform: 'translateY(0) scale(0.98)',
      },
    },
    secondary: {
      background: colors.surface,
      color: colors.text,
      border: `2px solid ${colors.border}`,
      hover: {
        background: colors.surfaceHover,
        borderColor: colors.borderDark,
      },
      active: {
        transform: 'translateY(0) scale(0.98)',
      },
    },
    danger: {
      background: colors.danger,
      color: colors.textInverse,
      border: 'none',
      hover: {
        background: '#dc2626',
        boxShadow: `0 8px 16px rgba(239, 68, 68, 0.3)`,
      },
      active: {
        transform: 'translateY(0) scale(0.98)',
      },
    },
    success: {
      background: colors.success,
      color: colors.textInverse,
      border: 'none',
      hover: {
        background: colors.primaryDark,
        boxShadow: `0 8px 16px rgba(16, 185, 129, 0.3)`,
      },
      active: {
        transform: 'translateY(0) scale(0.98)',
      },
    },
    warning: {
      background: colors.warning,
      color: '#ffffff',
      border: 'none',
      hover: {
        background: '#d97706',
        boxShadow: `0 8px 16px rgba(245, 158, 11, 0.3)`,
      },
      active: {
        transform: 'translateY(0) scale(0.98)',
      },
    },
    ghost: {
      background: 'transparent',
      color: colors.text,
      border: 'none',
      hover: {
        background: colors.glass,
      },
      active: {
        background: colors.glassLight,
      },
    },
  };

  // Size styles
  const sizeStyles = {
    sm: {
      padding: `${spacing.sm} ${spacing.md}`,
      ...typography.small,
      minHeight: '32px',
    },
    md: {
      padding: `${spacing.md} ${spacing.lg}`,
      ...typography.label,
      minHeight: '40px',
    },
    lg: {
      padding: `${spacing.lg} ${spacing.xl}`,
      ...typography.bodySmall,
      minHeight: '48px',
    },
  };

  const variantStyle = variantStyles[variant] || variantStyles.primary;
  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  const baseStyle = {
    ...sizeStyle,
    background: variantStyle.background,
    color: variantStyle.color,
    border: variantStyle.border,
    borderRadius: borderRadius.md,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    fontFamily: 'inherit',
    fontWeight: 600,
    transition: `transform ${transitions.sm}, box-shadow ${transitions.md}, background ${transitions.md}, border-color ${transitions.md}, opacity ${transitions.md}`,
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    ...style,
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`ui-button motion-pressable ${className}`.trim()}
      style={{
        ...baseStyle,
        ...(isHovered && !disabled && !loading ? variantStyle.hover : {}),
        ...(isHovered && !disabled && !loading ? { transform: 'translateY(-2px)' } : {}),
        ...(isActive && !disabled && !loading ? variantStyle.active : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      aria-busy={loading}
      aria-disabled={disabled}
      {...props}
    >
      {loading ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: 'currentColor',
              borderRadius: '50%',
            }}
            className="ui-button__spinner"
          />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
