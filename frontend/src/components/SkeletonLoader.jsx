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
  const skeletonStyle = {
    borderRadius: '8px',
  };

  const widths = ['92%', '86%', '78%', '88%', '72%'];

  if (type === 'course-item') {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px' }}>
              {/* Avatar skeleton */}
              <div className="vibrant-skeleton" style={{ ...skeletonStyle, width: '40px', height: '40px', flexShrink: 0 }} />
              {/* Title and subtitle skeleton */}
              <div style={{ flex: 1 }}>
                <div className="vibrant-skeleton" style={{ ...skeletonStyle, height: '16px', marginBottom: '6px', width: widths[i % widths.length] }} />
                <div className="vibrant-skeleton" style={{ ...skeletonStyle, height: '12px', width: '60%' }} />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="vibrant-skeleton" style={{ ...skeletonStyle, height: '28px', width: '60%' }} />
          <div className="vibrant-skeleton" style={{ ...skeletonStyle, height: '16px', width: '80%' }} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="vibrant-skeleton" style={{ ...skeletonStyle, height: '36px', width: '100px' }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (type === 'stats') {
    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <div className="vibrant-skeleton" style={{ ...skeletonStyle, height: '12px', marginBottom: '8px', width: '70%' }} />
              <div className="vibrant-skeleton" style={{ ...skeletonStyle, height: '20px', width: '40%' }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="vibrant-skeleton" style={{ ...skeletonStyle, height: '16px', width: widths[i % widths.length] }} />
        ))}
      </div>
    </>
  );
};

export default SkeletonLoader;
