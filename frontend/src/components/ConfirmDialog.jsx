import React from 'react';
import { spacing, typography, colors, borderRadius, shadows } from '../theme';
import Button from './Button';

/**
 * ConfirmDialog Component
 * Modal dialog for confirming actions with warning/info/success/danger variants
 * 
 * Features: title, message, action/cancel buttons, variants
 * 
 * Usage:
 * <ConfirmDialog 
 *   isOpen={showDialog}
 *   title="Delete Item?"
 *   message="This action cannot be undone."
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDialog(false)}
 *   variant="danger"
 * />
 */
export const ConfirmDialog = ({
  isOpen = false,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'info',
  className = '',
  style = {},
  ...props
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    info: {
      icon: 'ℹ️',
      color: colors.info,
    },
    success: {
      icon: '✓',
      color: colors.success,
    },
    warning: {
      icon: '⚠',
      color: colors.warning,
    },
    danger: {
      icon: '⚠',
      color: colors.danger,
    },
  };

  const config = variantConfig[variant] || variantConfig.info;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: spacing.lg,
    backdropFilter: 'blur(2px)',
  };

  const dialogStyle = {
    background: colors.surface,
    borderRadius: borderRadius.lg,
    boxShadow: shadows['2xl'],
    maxWidth: '400px',
    width: '100%',
    padding: spacing.xl,
    animation: 'slideIn 0.3s ease-out',
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  };

  const iconStyle = {
    fontSize: '32px',
    lineHeight: 1,
  };

  const titleStyle = {
    ...typography.h4,
    color: colors.text,
    margin: 0,
    flex: 1,
  };

  const messageStyle = {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 1.6,
  };

  const buttonsStyle = {
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'flex-end',
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      style={overlayStyle}
      onClick={handleBackdropClick}
      role="presentation"
      className={className}
      {...props}
    >
      <div style={dialogStyle} role="alertdialog" aria-modal="true">
        <div style={headerStyle}>
          <span style={iconStyle}>{config.icon}</span>
          <h2 style={titleStyle}>{title}</h2>
        </div>

        <p style={messageStyle}>{message}</p>

        <div style={buttonsStyle}>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
