import React from 'react';
import { spacing, typography, colors, borderRadius, transitions } from '../theme';

/**
 * Input Component
 * Unified text input with validation, error states, and labels
 * 
 * Features: label, error messages, icon support, different types
 * Sizes: sm, md, lg
 * 
 * Usage:
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input label="Password" type="password" error="Password is required" />
 */
export const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  disabled = false,
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  value,
  onChange,
  className = '',
  style = {},
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

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

  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyle = {
    ...typography.label,
    color: disabled ? colors.textMuted : colors.text,
    fontWeight: 600,
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: fullWidth ? '100%' : 'auto',
  };

  const iconHorizontalPadding = icon ? spacing['2xl'] : null;

  const inputStyle = {
    ...sizeStyle,
    width: '100%',
    background: disabled ? colors.surfaceDisabled : colors.surface,
    color: disabled ? colors.textMuted : colors.text,
    border: `2px solid ${
      error ? colors.danger : isFocused ? colors.primary : colors.border
    }`,
    borderRadius: borderRadius.md,
    fontFamily: 'inherit',
    transition: `all ${transitions.md}`,
    outline: 'none',
    paddingLeft: icon && iconPosition === 'left' ? iconHorizontalPadding : undefined,
    paddingRight: icon && iconPosition === 'right' ? iconHorizontalPadding : undefined,
    cursor: disabled ? 'not-allowed' : 'text',
    ...style,
  };

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [iconPosition]: spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0,
    color: error ? colors.danger : colors.textMuted,
    pointerEvents: 'none',
  };

  const errorStyle = {
    ...typography.small,
    color: colors.danger,
    marginTop: spacing.xs,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {props.required && <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <div style={inputContainerStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        {type === 'select' ? (
          <select
            ref={ref}
            disabled={disabled}
            value={value}
            onChange={onChange}
            style={inputStyle}
            className={className}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            <option value="" disabled hidden>{placeholder || 'Select an option'}</option>
            {props.options && props.options.map((opt, idx) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={idx} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
            style={inputStyle}
            className={className}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        )}
      </div>
      {error && (
        <span
          id={`${props.id}-error`}
          style={errorStyle}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
