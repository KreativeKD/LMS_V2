const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
content = content.replace('background: "#fef2f2",', 'background: "rgba(239, 68, 68, 0.1)",');
fs.writeFileSync('frontend/src/components/Navbar.jsx', content);
console.log("Done");
