import React from 'react';
import { spacing, typography, colors, borderRadius, shadows, transitions } from '../theme';

/**
 * Table Component
 * Reusable table with headers, rows, and optional striping
 * 
 * Features: sortable columns, striped rows, actions column
 * 
 * Usage:
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Name', width: '200px' },
 *     { key: 'email', label: 'Email', width: '300px' }
 *   ]}
 *   data={[
 *     { id: 1, name: 'John', email: 'john@example.com' },
 *     { id: 2, name: 'Jane', email: 'jane@example.com' }
 *   ]}
 *   onRowClick={(row) => console.log(row)}
 * />
 */
export const Table = ({
  columns = [],
  data = [],
  loading = false,
  striped = true,
  hoverable = true,
  onRowClick,
  actions,
  emptyMessage = 'No data available',
  className = '',
  style = {},
  ...props
}) => {
  const [hoveredRow, setHoveredRow] = React.useState(null);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    ...style,
  };

  const tableWrapperStyle = {
    overflowX: 'auto',
    borderRadius: borderRadius.md,
    boxShadow: shadows.md,
    border: `1px solid ${colors.border}`,
  };

  const theadStyle = {
    background: colors.surfaceHover,
  };

  const thStyle = {
    ...typography.label,
    color: colors.text,
    padding: spacing.lg,
    textAlign: 'left',
    fontWeight: 700,
    borderBottom: `2px solid ${colors.border}`,
    whiteSpace: 'nowrap',
  };

  const tbodyStyle = {};

  const trStyle = (isEven, isHovered = false) => ({
    borderBottom: `1px solid ${colors.border}`,
    background: isHovered ? colors.surfaceHover : (striped && isEven ? (colors.surfaceAlt || colors.surfaceHover) : colors.surface),
    transition: `background ${transitions.md}, transform ${transitions.sm}, box-shadow ${transitions.md}`,
    transform: isHovered && onRowClick ? 'translateY(-1px)' : 'none',
    boxShadow: isHovered && onRowClick ? '0 8px 18px rgba(79, 70, 229, 0.08)' : 'none',
    cursor: onRowClick ? 'pointer' : 'default',
  });

  const tdStyle = {
    ...typography.bodySmall,
    color: colors.text,
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border}`,
  };

  const skeletonStyle = {
    background: colors.skeleton || 'var(--skeleton-base)',
    borderRadius: borderRadius.sm,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: `${spacing.xl} ${spacing.lg}`,
    color: colors.textMuted,
  };

  return (
    <div style={tableWrapperStyle} className={className} {...props}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  ...thStyle,
                  width: column.width,
                }}
              >
                {column.label}
              </th>
            ))}
            {actions && <th style={thStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody style={tbodyStyle}>
          {loading ? (
            // Skeleton loading rows
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} style={trStyle(idx % 2 === 0)}>
                {columns.map((column) => (
                  <td key={`${column.key}-skeleton`} style={tdStyle}>
                    <div
                      style={{
                        ...skeletonStyle,
                        height: '16px',
                        width: '80%',
                      }}
                      className="vibrant-skeleton"
                    />
                  </td>
                ))}
                {actions && (
                  <td style={tdStyle}>
                    <div
                      style={{
                        ...skeletonStyle,
                        height: '32px',
                        width: '60px',
                      }}
                      className="vibrant-skeleton"
                    />
                  </td>
                )}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                style={{
                  ...tdStyle,
                  ...emptyStateStyle,
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                style={trStyle(rowIdx % 2 === 0, hoverable && hoveredRow === rowIdx)}
                onClick={() => onRowClick && onRowClick(row)}
                onMouseEnter={() => setHoveredRow(rowIdx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {columns.map((column) => (
                  <td key={column.key} style={tdStyle}>
                    {typeof column.render === 'function'
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: 'flex',
                        gap: spacing.sm,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
