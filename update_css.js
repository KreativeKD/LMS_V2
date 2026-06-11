const fs = require('fs');
let content = fs.readFileSync('frontend/src/index.css', 'utf8');

// Replace auth-navbar background
content = content.replace(
  /(\.auth-navbar\s*\{[\s\S]*?background:\s*)rgba\(255,\s*255,\s*255,\s*0\.9\);/,
  '$1var(--card-bg);'
);

// Replace coursez-description-section background
content = content.replace(
  /(\.coursez-description-section \.hero-subtitle:first-child\s*\{[\s\S]*?background:\s*)rgba\(255,\s*255,\s*255,\s*0\.8\);/,
  '$1var(--card-bg);'
);

// Replace auth-bell-btn background
content = content.replace(
  /(\.auth-bell-btn\s*\{[\s\S]*?background:\s*)white;/,
  '$1var(--card-bg);'
);

// Replace auth-notification-panel background
content = content.replace(
  /(\.auth-notification-panel\s*\{[\s\S]*?background:\s*)#fff;/,
  '$1var(--card-bg);'
);

fs.writeFileSync('frontend/src/index.css', content);
console.log('index.css updated');
