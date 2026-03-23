import React from 'react';

// Loading component for lazy-loaded routes
const RouteLoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    gap: '1rem'
  }}>
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

export default RouteLoadingSpinner;
