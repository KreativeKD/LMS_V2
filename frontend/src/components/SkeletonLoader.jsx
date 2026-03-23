import React from 'react';

/**
 * SkeletonLoader Component
 * Shows animated placeholder content while data loads
 *
 * Props:
 * - type: 'course-item' | 'course-header' | 'stats' | 'list'
 * - count: number of items to show (default 3)
 */
export const SkeletonLoader = ({ type = 'course-item', count = 3 }) => {
  const pulseKeyframes = `
    @keyframes skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `;

  const skeletonStyle = {
    animation: 'skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    background: '#e5e7eb',
    borderRadius: '8px',
  };

  if (type === 'course-item') {
    return (
      <>
        <style>{pulseKeyframes}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px' }}>
              {/* Avatar skeleton */}
              <div style={{ ...skeletonStyle, width: '40px', height: '40px', flexShrink: 0 }} />
              {/* Title and subtitle skeleton */}
              <div style={{ flex: 1 }}>
                <div style={{ ...skeletonStyle, height: '16px', marginBottom: '6px' }} />
                <div style={{ ...skeletonStyle, height: '12px', width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (type === 'course-header') {
    return (
      <>
        <style>{pulseKeyframes}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ ...skeletonStyle, height: '28px', width: '60%' }} />
          <div style={{ ...skeletonStyle, height: '16px', width: '80%' }} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} style={{ ...skeletonStyle, height: '36px', width: '100px' }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (type === 'stats') {
    return (
      <>
        <style>{pulseKeyframes}</style>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <div style={{ ...skeletonStyle, height: '12px', marginBottom: '8px', width: '70%' }} />
              <div style={{ ...skeletonStyle, height: '20px', width: '40%' }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ ...skeletonStyle, height: '16px', width: `${80 + Math.random() * 20}%` }} />
        ))}
      </div>
    </>
  );
};

export default SkeletonLoader;
