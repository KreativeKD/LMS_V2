import React from 'react';
import { spacing, colors, borderRadius, shadows } from '../theme';

/**
 * PageLayout Component
 * Consistent page wrapper with header, title, breadcrumb, content area
 * 
 * Features: header with title/breadcrumb, sidebar, footer
 * 
 * Usage:
 * <PageLayout 
 *   title="Dashboard"
 *   breadcrumbs={items}
 *   header={<Header />}
 *   sidebar={<Sidebar />}
 * >
 *   Page content here
 * </PageLayout>
 */
export const PageLayout = ({
  title,
  breadcrumbs,
  header,
  sidebar,
  children,
  footer,
  hasSidebar = false,
  maxWidth = '1280px',
  className = '',
  style = {},
  ...props
}) => {
  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: colors.background,
  };

  const headerStyle = {
    background: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: shadows.sm,
    padding: `${spacing.lg} ${spacing.xl}`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const headerContentStyle = {
    maxWidth: maxWidth,
    margin: '0 auto',
    width: '100%',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.text,
    margin: 0,
    marginTop: breadcrumbs ? spacing.md : 0,
  };

  const containerStyle = {
    flex: 1,
    display: 'flex',
    maxWidth: '100%',
  };

  const sidebarWrapperStyle = {
    width: '240px',
    background: colors.surface,
    borderRight: `1px solid ${colors.border}`,
    padding: spacing.lg,
    overflowY: 'auto',
  };

  const mainContentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: spacing.xl,
    maxWidth: '100%',
  };

  const contentWrapperStyle = {
    maxWidth: hasSidebar ? '100%' : maxWidth,
    margin: '0 auto',
    width: '100%',
    flex: 1,
  };

  const footerStyle = {
    background: colors.surface,
    borderTop: `1px solid ${colors.border}`,
    padding: `${spacing.lg} ${spacing.xl}`,
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.textMuted,
  };

  return (
    <div style={{ ...pageStyle, ...style }} className={className} {...props}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          {breadcrumbs}
          {title && <h1 style={titleStyle}>{title}</h1>}
          {header}
        </div>
      </header>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Sidebar */}
        {sidebar && hasSidebar && (
          <aside style={sidebarWrapperStyle}>
            {sidebar}
          </aside>
        )}

        {/* Content */}
        <main style={mainContentStyle}>
          <div style={contentWrapperStyle}>
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && <footer style={footerStyle}>{footer}</footer>}
    </div>
  );
};

export default PageLayout;
