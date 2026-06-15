const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf8');

css = css.replace(
  /(\.public-navbar\s*\.nav-link\s*\{[\s\S]*?font-weight:\s*)600(;)/,
  '$1700$2'
);

fs.writeFileSync('frontend/src/index.css', css);
console.log('Made public navbar links bold.');
