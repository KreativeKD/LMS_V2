import React from 'react';
import { InboxIcon, AlertCircle } from 'lucide-react';

/**
 * EmptyState Component
 * Displays a friendly, helpful message when there's no data
 * 
 * Props:
 * - icon: Lucide icon component to display
 * - title: Main message (e.g., "No courses enrolled")
 * - message: Detailed explanation
 * - actionButton: Optional object with {label, onClick}
 * - type: 'empty' or 'error'
 */
export const EmptyState = ({
  icon: Icon = InboxIcon,
  title = "No data found",
  message = "There's nothing here yet. Check back later!",
  actionButton = null,
  type = 'empty'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        minHeight: '300px',
        borderRadius: '16px',
        background: type === 'error' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        border: `2px dashed ${type === 'error' ? '#fca5a5' : '#e5e7eb'}`,
      }}
      role="status"
      aria-label={title}
    >
      {/* Icon */}
      <Icon
        size={48}
        style={{
          color: type === 'error' ? '#ef4444' : '#9ca3af',
          marginBottom: '1rem',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* Title */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>

      {/* Message */}
      <p
        style={{
          fontSize: '0.95rem',
          color: '#6b7280',
          marginBottom: '1.5rem',
          maxWidth: '400px',
        }}
      >
        {message}
      </p>

      {/* Action Button */}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          style={{
            background: 'var(--text-gradient)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          aria-label={actionButton.ariaLabel || actionButton.label}
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
