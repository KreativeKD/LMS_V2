import React from 'react';
import { spacing, colors, borderRadius, shadows, typography } from '../theme';

/**
 * Card Component
 * Reusable card container with header, footer, and flexible content
 * 
 * Variants: default, elevated, ghost
 * Features: header, footer, image, flexible content
 * 
 * Usage:
 * <Card>Content</Card>
 * <Card header="Title" footer="Footer">Content</Card>
 * <Card variant="elevated" image={<img src="..." />}>Content</Card>
 */
export const Card = ({
  variant = 'default',
  header,
  footer,
  image,
  children,
  onClick,
  className = '',
  style = {},
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No content',
  overflow = 'hidden',
  ...props
}) => {
  const variantStyles = {
    default: {
      background: colors.surface,
      boxShadow: shadows.md,
      border: `1px solid ${colors.border}`,
    },
    elevated: {
      background: colors.surface,
      boxShadow: shadows.lg,
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      boxShadow: 'none',
      border: `1px solid ${colors.borderLight}`,
    },
  };

  const variantStyle = variantStyles[variant] || variantStyles.default;

  const containerStyle = {
    ...variantStyle,
    borderRadius: borderRadius.lg,
    overflow: overflow,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    width: '100%',
    ...style,
  };

  const imageStyle = {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    display: 'block',
  };

  const headerStyle = {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border}`,
    background: colors.surfaceHover,
  };

  const headerTextStyle = {
    ...typography.h4,
    color: colors.text,
    margin: 0,
  };

  const contentStyle = {
    padding: spacing.lg,
    minHeight: isEmpty ? '120px' : 'auto',
    display: 'flex',
    alignItems: isEmpty ? 'center' : 'flex-start',
    justifyContent: isEmpty ? 'center' : 'flex-start',
  };

  const footerStyle = {
    padding: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
    background: colors.surfaceHover,
    display: 'flex',
    gap: spacing.md,
  };

  const emptyStateStyle = {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  };

  const skeletonStyle = {
    background: colors.skeleton,
    borderRadius: borderRadius.md,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <div
      style={containerStyle}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      {...props}
    >
      {image && <img src={typeof image === 'string' ? image : undefined} style={imageStyle} alt="Card" />}

      {isLoading ? (
        <div style={contentStyle}>
          <div
            style={{
              ...skeletonStyle,
              width: '100%',
              height: '120px',
            }}
          />
        </div>
      ) : (
        <>
          {header && (
            <div style={headerStyle}>
              {typeof header === 'string' ? <h3 style={headerTextStyle}>{header}</h3> : header}
            </div>
          )}

          <div style={contentStyle}>
            {isEmpty ? (
              <span style={emptyStateStyle}>{emptyMessage}</span>
            ) : (
              children
            )}
          </div>

          {footer && <div style={footerStyle}>{footer}</div>}
        </>
      )}
    </div>
  );
};

export default Card;
