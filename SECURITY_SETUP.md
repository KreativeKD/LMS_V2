# Security Fixes - Quick Start Guide

## What Was Fixed

All critical security vulnerabilities have been addressed:

### ✅ 1. JWT Secret Security

- Removed all hardcoded fallback secrets (`'fallback_secret_key_123'`)
- Server now fails to start if `JWT_SECRET` is not defined
- Must use strong, unique secret in production

### ✅ 2. Environment Variables

- Created `.env.example` templates for backend and frontend
- All sensitive config moved to environment variables
- Added validation on server startup

### ✅ 3. Input Validation

- Added Joi validation library
- Password complexity requirements: 8+ chars, uppercase, lowercase, number, special character
- Validates all user inputs (login, registration, profile, courses)

### ✅ 4. Rate Limiting

- Login: 5 attempts per 15 minutes
- Registration: 3 attempts per hour
- General API: 100 requests per 15 minutes
- Prevents brute force attacks

### ✅ 5. NoSQL Injection Prevention

- Added express-mongo-sanitize
- Automatically removes dangerous MongoDB operators from user input
- Applied globally to all routes

### ✅ 6. CORS Configuration

- Restricted to specific frontend URL
- No longer accepts requests from any origin
- Prevents CSRF attacks

### ✅ 7. API URL Configuration

- Frontend now uses environment variable for API URL
- Easy to configure for production deployment

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Generate a secure JWT secret:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Copy the output (it will look like: `a1b2c3d4e5f6...`)

3. **Create .env file:**
   Create a file named `.env` in the `backend/` directory with:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=paste_the_generated_secret_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Start the server:**

   ```bash
   npm run dev
   ```

   The server will now:
   - Check for required environment variables
   - Fail to start if JWT_SECRET or MONGO_URI is missing
   - Apply all security middleware

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **The .env file has been created** with:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Testing Security Features

### Test 1: Password Validation

Try to register with a weak password:

- ❌ "password" → Should fail (no uppercase, number, special char)
- ❌ "Pass123" → Should fail (no special character)
- ✅ "Pass123!@" → Should succeed

### Test 2: Rate Limiting

Try to login multiple times with wrong credentials:

- Attempts 1-5: Will return authentication errors
- Attempt 6+: Will return rate limit error (429 status)
- Wait 15 minutes, then try again

### Test 3: Input Validation

Try to register without required fields:

- Should return detailed validation errors
- Each missing/invalid field will be listed

### Test 4: NoSQL Injection Prevention

Previously, these attacks would work. Now they're blocked:

```javascript
// These are now safely sanitized
{"username": {"$ne": ""}, "password": "anything"}
{"username": {"$gt": ""}, "password": {"$gt": ""}}
```

## What Changed in the Code

### Files Modified:

1. `backend/server.js` - Added environment validation, CORS config, mongo sanitization
2. `backend/middleware/auth.js` - Removed JWT secret fallback
3. `backend/routes/auth.js` - Added validation and rate limiting to all routes
4. `backend/routes/course.js` - Added validation and rate limiting
5. `frontend/src/api/api.js` - Uses environment variable for API URL

### Files Created:

1. `backend/.env.example` - Environment variable template
2. `backend/middleware/validation.js` - Joi validation schemas
3. `backend/middleware/rateLimiters.js` - Rate limiting configurations
4. `frontend/.env.example` - Frontend environment template
5. `frontend/.env` - Frontend environment file
6. `SECURITY.md` - Comprehensive security documentation

### Dependencies Added:

- `joi` - Input validation
- `express-rate-limit` - Rate limiting
- `express-mongo-sanitize` - NoSQL injection prevention

## Common Issues & Solutions

### Issue: Server won't start

**Error:** "FATAL ERROR: JWT_SECRET is not defined"
**Solution:** Create `.env` file with JWT_SECRET

### Issue: Frontend can't connect to backend

**Error:** CORS errors in browser console
**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: Rate limit errors during development

**Solution:** Rate limits reset after time window. For testing, you can temporarily increase limits in `backend/middleware/rateLimiters.js`

### Issue: Validation errors on existing functionality

**Solution:** Update your requests to include all required fields with proper format

## Security Best Practices

### For Development:

- ✅ Never commit `.env` files
- ✅ Use different JWT secrets for dev/staging/production
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ Test with weak passwords to ensure validation works

### For Production:

- ✅ Generate new strong JWT secret (32+ characters)
- ✅ Set `NODE_ENV=production`
- ✅ Use HTTPS for all connections
- ✅ Configure production MongoDB with authentication
- ✅ Set proper CORS origin (your production domain)
- ✅ Enable MongoDB Atlas IP whitelist
- ✅ Regular security audits

## Verification Checklist

After setup, verify:

- [ ] Server starts without errors
- [ ] Frontend connects to backend
- [ ] Can't login with weak password
- [ ] Rate limiting works (try 6 login attempts)
- [ ] Validation errors are clear and helpful
- [ ] No console errors about CORS
- [ ] JWT token is generated on successful login

## Need Help?

See the full security documentation: [SECURITY.md](SECURITY.md)

---

**Note:** The application is now significantly more secure, but some features (like JWT in localStorage) have known limitations. See SECURITY.md for details and future enhancements.
