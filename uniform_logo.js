const fs = require('fs');

let css = fs.readFileSync('frontend/src/index.css', 'utf8');

// The uniform style we want for the logo everywhere
const newLogoStyle = `.nav-logo img {
  mix-blend-mode: normal !important;
  filter: contrast(1.08);
  background: #ffffff !important;
  padding: 6px 12px !important;
  border-radius: 14px !important;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;
}`;

// 1. Replace the base .nav-logo img
css = css.replace(/\.nav-logo img\s*\{[\s\S]*?\}/, newLogoStyle);

// 2. Remove the scrolled override
css = css.replace(/\.nav-bar\.scrolled \.nav-logo img\s*\{[\s\S]*?\}/, '');

// 3. Remove the auth-navbar override
css = css.replace(/\.auth-navbar \.nav-logo img\s*\{[\s\S]*?\}/, '');

fs.writeFileSync('frontend/src/index.css', css);
console.log('Uniform logo styles applied.');
