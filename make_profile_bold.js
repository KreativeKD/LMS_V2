const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf8');

css = css.replace(
  /(\.auth-profile-name\s*\{\s*font-size:\s*0\.9rem;)/,
  '$1\n  font-weight: 700;'
);

fs.writeFileSync('frontend/src/index.css', css);
console.log('Made auth profile name bold.');
