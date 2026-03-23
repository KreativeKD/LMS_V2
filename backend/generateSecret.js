/**
 * Generate a secure JWT secret for the LMS application
 * Run this with: node generateSecret.js
 */

const crypto = require('crypto');

console.log('\n=== LMS JWT Secret Generator ===\n');

// Generate a 32-byte (256-bit) random secret
const secret = crypto.randomBytes(32).toString('hex');

console.log('Your secure JWT secret:');
console.log('\x1b[32m%s\x1b[0m', secret);
console.log('\n📋 Copy this secret and paste it in your backend/.env file as:');
console.log('\x1b[33m%s\x1b[0m', `JWT_SECRET=${secret}`);
console.log('\n⚠️  Important:');
console.log('- Keep this secret secure and never commit it to version control');
console.log('- Use different secrets for development, staging, and production');
console.log('- Store production secrets in secure environment variable management systems');
console.log('\n');
