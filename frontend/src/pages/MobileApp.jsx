import React from 'react';

const MobileApp = () => {
  const fileId = '1PC6s9UbmhfodjYH_gk7Xd7mMR-AA8-uv';
  const driveViewUrl = `https://drive.google.com/file/d/${fileId}/view`;
  const directDownload = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return (
    <div style={{ padding: '2rem', maxWidth: 780, margin: '0 auto' }}>
      <h1>Mobile App</h1>
      <p>Download the latest Android APK for the mobile app below.</p>

      <div style={{ marginTop: 20 }}>
        <a
          href={driveViewUrl}
          className="btn-primary"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '0.75rem 1rem', display: 'inline-block' }}
        >
          Download APK
        </a>
      </div>

      <div style={{ marginTop: 18, color: 'var(--text-muted)' }}>
        <strong>Note:</strong> On Android devices you may need to allow installs from unknown sources to install this APK.
      </div>
    </div>
  );
};

export default MobileApp;
