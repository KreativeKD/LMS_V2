# Security Implementation Guide

## Overview

This document outlines the security measures implemented in the LMS application to protect against common vulnerabilities and attacks.

## Security Features Implemented

### 1. Environment Variable Management

- **What**: All sensitive configuration moved to environment variables
- **Why**: Prevents hardcoded secrets in source code
- **Files**: `.env.example` templates provided for both backend and frontend
- **Required Variables**:
  - `JWT_SECRET`: Secure random string for JWT token signing (minimum 32 characters)
  - `MONGO_URI`: MongoDB connection string
  - `FRONTEND_URL`: Allowed frontend origin for CORS
  - `VITE_API_URL`: Backend API URL (frontend)

**Generate secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Input Validation

- **Library**: Joi validation library
- **Implementation**: `backend/middleware/validation.js`
- **Coverage**:
  - Login credentials
  - Registration data with email format validation
  - Profile updates
  - Course/Chapter/Unit creation
  - Password complexity requirements

#### Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&\*)

### 3. Rate Limiting

- **Library**: express-rate-limit
- **Implementation**: `backend/middleware/rateLimiters.js`
- **Limits**:
  - **Login**: 5 attempts per 15 minutes per IP
  - **Registration**: 3 attempts per hour per IP
  - **General Auth**: 10 attempts per 15 minutes per IP
  - **API Calls**: 100 requests per 15 minutes per IP

### 4. NoSQL Injection Prevention

- **Library**: express-mongo-sanitize
- **Implementation**: Applied globally in `server.js`
- **Protection**: Removes `$` and `.` characters from user input to prevent MongoDB operator injection

### 5. CORS Configuration

- **Implementation**: `server.js`
- **Configuration**: Restricted to specific frontend URL
- **Benefits**: Prevents unauthorized cross-origin requests and CSRF attacks
- **Settings**:
  ```javascript
  {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
  ```

### 6. JWT Security

- **Implementation**: All JWT operations in auth routes
- **Changes**:
  - Removed all hardcoded fallback secrets
  - Server fails to start if `JWT_SECRET` is not defined
  - Enforces strong secret requirement

## Setup Instructions

### 1. Backend Configuration

1. **Copy environment template:**

   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configure environment variables:**
   - Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Add MongoDB Atlas connection string
   - Set frontend URL
   - Save `.env` file

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

### 2. Frontend Configuration

1. **Copy environment template:**

   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Configure API URL:**
   - Development: `VITE_API_URL=http://localhost:5000`
   - Production: `VITE_API_URL=https://api.yourdomain.com`

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Production Deployment Checklist

- [ ] Generate strong JWT secret (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB connection string
- [ ] Set production frontend URL for CORS
- [ ] Enable HTTPS/TLS
- [ ] Regular security audits: `npm audit`
- [ ] Keep dependencies updated
- [ ] Monitor rate limit violations
- [ ] Implement logging and monitoring

## Security Best Practices

### For Developers

1. **Never commit `.env` files** to version control
2. **Rotate JWT secrets** regularly in production
3. **Use strong passwords** for admin accounts
4. **Validate all user input** on both client and server
5. **Keep dependencies updated** to patch vulnerabilities
6. **Review code** for security issues before deployment

### For Users

1. **Use strong passwords** meeting complexity requirements
2. **Don't share credentials** across multiple accounts
3. **Report suspicious activity** to administrators
4. **Keep browser updated** for security patches

## Rate Limiting Behavior

### User Experience

When rate limits are exceeded:

- **Status Code**: 429 (Too Many Requests)
- **Response**: JSON with error message
- **Headers**: Include `RateLimit-*` information
- **Action**: User must wait until the time window expires

### Monitoring

Rate limit violations are logged automatically. Monitor for:

- Unusual patterns indicating brute force attacks
- IP addresses exceeding limits repeatedly
- Consider IP blocking for persistent violators

## Validation Error Responses

Validation failures return detailed error messages:

```json
{
  "error": "Validation failed",
  "details": [
    "Password must be at least 8 characters long",
    "Email is required"
  ]
}
```

## Testing Security Features

### Test Rate Limiting

```bash
# Attempt multiple logins rapidly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test@student","password":"wrong"}'
  echo "\nAttempt $i"
done
```

### Test Password Validation

```bash
# Test weak password (should fail)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"weak",...}'
```

### Test Input Sanitization

```bash
# Test NoSQL injection (should be sanitized)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@admin","password":{"$ne":""}}'
```

## Known Limitations

1. **JWT Storage**: Tokens stored in localStorage (XSS vulnerable)
   - **Mitigation**: Implement Content Security Policy (CSP)
   - **Alternative**: Consider httpOnly cookies for production

2. **Rate Limiting by IP**: May affect users behind shared IPs
   - **Mitigation**: Implement user-based rate limiting for authenticated routes

3. **No Account Lockout**: After rate limit expires, attempts reset
   - **Enhancement**: Implement permanent account lockout after X failed attempts

## Future Security Enhancements

1. **Two-Factor Authentication (2FA)**
2. **Email Verification**
3. **Password Reset Flow**
4. **Account Lockout Mechanism**
5. **Security Headers** (Helmet.js)
6. **Content Security Policy (CSP)**
7. **Session Management** with refresh tokens
8. **Audit Logging** of security events
9. **IP Whitelisting** for admin accounts
10. **Automated Security Scanning** in CI/CD

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Email security concerns to: [security@yourdomain.com]
3. Include detailed description and reproduction steps
4. Allow reasonable time for patching before disclosure

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Last Updated**: March 4, 2026
**Version**: 2.0.0
