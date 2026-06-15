const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf8');

const additionalCSS = `
.auth-navbar .nav-link {
  color: var(--text-muted);
}

.auth-navbar .nav-link:hover {
  color: var(--primary);
  text-shadow: none;
}

.auth-navbar .nav-link.active {
  color: var(--primary);
}
`;

// Insert the additional CSS after the .auth-navbar block
css = css.replace(
  /(\.auth-navbar\s*\{[\s\S]*?z-index:\s*1000;\s*\})/,
  `$1\n${additionalCSS}`
);

fs.writeFileSync('frontend/src/index.css', css);
console.log('Fixed auth-navbar link colors.');
