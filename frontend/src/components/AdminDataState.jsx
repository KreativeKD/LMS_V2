import React from 'react';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { colors, spacing, typography } from '../theme';

export const AdminDataState = ({
  type = 'loading', // loading | empty | error
  title,
  message,
  actionLabel = 'Retry',
  onAction
}) => {
  const config = {
    loading: {
      icon: <Loader2 size={24} color={colors.primary} className="spin-icon" />,
      defaultTitle: 'Loading data',
      defaultMessage: 'Fetching the latest records...'
    },
    empty: {
      icon: <Inbox size={24} color={colors.textMuted} />,
      defaultTitle: 'No records found',
      defaultMessage: 'There is nothing to show yet.'
    },
    error: {
      icon: <AlertCircle size={24} color={colors.danger} />,
      defaultTitle: 'Could not load data',
      defaultMessage: 'Please try again.'
    }
  };

  const current = config[type] || config.loading;

  return (
    <>
      <style>
        {`
          .spin-icon {
            animation: admin-spin 1s linear infinite;
          }

          @keyframes admin-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <Card>
        <div
          style={{
            width: '100%',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: spacing.sm
          }}
        >
          {current.icon}
          <h3 style={{ ...typography.h5, margin: 0 }}>{title || current.defaultTitle}</h3>
          <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
            {message || current.defaultMessage}
          </p>
          {onAction && (
            <Button size="sm" variant={type === 'error' ? 'danger' : 'secondary'} onClick={onAction} style={{ marginTop: spacing.sm }}>
              {actionLabel}
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};

export default AdminDataState;
