const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf8');

// Replace .nav-bar background
css = css.replace(/(\.nav-bar\s*\{[\s\S]*?background:\s*)[^;]+(;)/, '$1#2d3748$2');

// Replace .nav-bar.scrolled background
css = css.replace(/(\.nav-bar\.scrolled\s*\{[\s\S]*?background:\s*)[^;]+(;)/, '$1#2d3748$2');

// Replace .nav-link color
css = css.replace(/(\.nav-link\s*\{[\s\S]*?color:\s*)[^;]+(;)/, '$1#f1f5f9$2');

fs.writeFileSync('frontend/src/index.css', css);
console.log('Navbar updated to navy blue.');
