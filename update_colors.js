const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf8');

// 1. Update Announcements Panel
css = css.replace(
  /(\.home-announcements-panel\s*\{[\s\S]*?background:\s*)[^;]+(;)/,
  '$1#2d3748$2'
);
css = css.replace(
  /(\.home-announcements-panel\s*\{[\s\S]*?border:\s*)[^;]+(;)/,
  '$11px solid rgba(255, 255, 255, 0.1)$2'
);

// 2. Update Announcement Item (make it slightly darker or lighter than the panel)
css = css.replace(
  /(\.announcement-item\s*\{[\s\S]*?background:\s*)[^;]+(;)/,
  '$1rgba(0, 0, 0, 0.15)$2'
);

// 3. Update Breaking Ticker
css = css.replace(
  /(\.breaking-ticker-wrap\s*\{[\s\S]*?background:\s*)[^;]+(;)/,
  '$1#2d3748$2'
);
css = css.replace(
  /(\.breaking-ticker-wrap\s*\{[\s\S]*?border:\s*)[^;]+(;)/,
  '$11px solid rgba(255, 255, 255, 0.1)$2'
);

fs.writeFileSync('frontend/src/index.css', css);
console.log('Announcements and Ticker updated to match navy blue navbar.');
