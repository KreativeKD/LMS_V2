import React from 'react';
import { spacing, typography, colors, transitions } from '../theme';

/**
 * Breadcrumb Component
 * Shows navigation hierarchy for nested pages
 * 
 * Features: clickable items, current page indication
 * 
 * Usage:
 * <Breadcrumb items={[
 *   { label: 'Home', onClick: () => navigate('/') },
 *   { label: 'Courses', onClick: () => navigate('/courses') },
 *   { label: 'React 101', current: true }
 * ]} />
 */
export const Breadcrumb = ({
  items = [],
  separator = '/',
  className = '',
  style = {},
  ...props
}) => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
    padding: `${spacing.md} 0`,
    marginBottom: spacing.md,
    ...style,
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const linkStyle = {
    ...typography.bodySmall,
    color: colors.primary,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `color ${transitions.md}`,
    '&:hover': {
      color: colors.primaryDark,
      textDecoration: 'underline',
    },
  };

  const currentStyle = {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: 600,
    cursor: 'default',
  };

  const separatorStyle = {
    color: colors.textMuted,
    ...typography.small,
  };

  const handleClick = (item) => {
    if (item.onClick && !item.current) {
      item.onClick();
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      style={containerStyle}
      className={className}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} style={itemStyle}>
          <button
            type="button"
            onClick={() => handleClick(item)}
            disabled={item.current}
            style={{
              ...(!item.current ? linkStyle : currentStyle),
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: item.current ? 'default' : 'pointer',
              font: 'inherit',
              fontFamily: 'inherit',
            }}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.label}
          </button>
          {index < items.length - 1 && (
            <span style={separatorStyle}>{separator}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
