import React from 'react';
import { spacing, typography, colors, borderRadius, transitions } from '../theme';
import Button from './Button';

/**
 * Pagination Component
 * Reusable pagination with page numbers and navigation
 * 
 * Features: first/last, previous/next, page numbers
 * 
 * Usage:
 * <Pagination 
 *   current={page} 
 *   total={totalPages} 
 *   onPageChange={setPage}
 *   itemsPerPage={10}
 *   totalItems={100}
 * />
 */
export const Pagination = ({
  current = 1,
  total = 1,
  onPageChange,
  itemsPerPage,
  totalItems,
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  const maxPagesToShow = 5;
  const halfWindow = Math.floor(maxPagesToShow / 2);

  // Calculate start and end pages for pagination window
  let startPage = Math.max(1, current - halfWindow);
  let endPage = Math.min(total, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
    ...style,
  };

  const pageButtonBaseStyle = {
    minWidth: '40px',
    minHeight: '40px',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.md,
    border: `2px solid ${colors.border}`,
    background: 'transparent',
    color: colors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${transitions.md}`,
    fontFamily: 'inherit',
    ...typography.label,
    fontWeight: 600,
  };

  const pageButtonActiveStyle = {
    background: colors.gradient,
    color: colors.textInverse,
    border: `2px solid transparent`,
  };

  const pageButtonDisabledStyle = {
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const infoStyle = {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.lg,
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= total && !disabled) {
      onPageChange(page);
    }
  };

  if (total <= 1) {
    return null;
  }

  return (
    <div style={containerStyle} className={className} {...props}>
      {/* First Page Button */}
      <button
        style={{
          ...pageButtonBaseStyle,
          ...(disabled ? pageButtonDisabledStyle : {}),
        }}
        onClick={() => handlePageChange(1)}
        disabled={current === 1 || disabled}
        aria-label="Go to first page"
        title="First page"
      >
        &lsaquo;&lsaquo;
      </button>

      {/* Previous Button */}
      <button
        style={{
          ...pageButtonBaseStyle,
          ...(disabled || current === 1 ? pageButtonDisabledStyle : {}),
        }}
        onClick={() => handlePageChange(current - 1)}
        disabled={current === 1 || disabled}
        aria-label="Go to previous page"
        title="Previous page"
      >
        &lsaquo;
      </button>

      {/* Page Numbers */}
      {startPage > 1 && (
        <>
          <button
            style={{
              ...pageButtonBaseStyle,
              ...(disabled ? pageButtonDisabledStyle : {}),
            }}
            onClick={() => handlePageChange(1)}
            disabled={disabled}
          >
            1
          </button>
          {startPage > 2 && (
            <span style={{ ...typography.small, color: colors.textMuted }}>
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          style={{
            ...pageButtonBaseStyle,
            ...(page === current ? pageButtonActiveStyle : {}),
            ...(disabled ? pageButtonDisabledStyle : {}),
          }}
          onClick={() => handlePageChange(page)}
          disabled={disabled}
          aria-label={`Page ${page}`}
          aria-current={page === current ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {endPage < total && (
        <>
          {endPage < total - 1 && (
            <span style={{ ...typography.small, color: colors.textMuted }}>
              ...
            </span>
          )}
          <button
            style={{
              ...pageButtonBaseStyle,
              ...(disabled ? pageButtonDisabledStyle : {}),
            }}
            onClick={() => handlePageChange(total)}
            disabled={disabled}
          >
            {total}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        style={{
          ...pageButtonBaseStyle,
          ...(disabled || current === total ? pageButtonDisabledStyle : {}),
        }}
        onClick={() => handlePageChange(current + 1)}
        disabled={current === total || disabled}
        aria-label="Go to next page"
        title="Next page"
      >
        &rsaquo;
      </button>

      {/* Last Page Button */}
      <button
        style={{
          ...pageButtonBaseStyle,
          ...(disabled ? pageButtonDisabledStyle : {}),
        }}
        onClick={() => handlePageChange(total)}
        disabled={current === total || disabled}
        aria-label="Go to last page"
        title="Last page"
      >
        &rsaquo;&rsaquo;
      </button>

      {/* Info Text */}
      {itemsPerPage && totalItems && (
        <div style={infoStyle}>
          Page {current} of {total} ({totalItems} total items)
        </div>
      )}
    </div>
  );
};

export default Pagination;
