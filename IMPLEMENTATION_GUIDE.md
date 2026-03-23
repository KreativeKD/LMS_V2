# 🚀 QUICK START: Top Priority Fixes

## Overview

This guide provides step-by-step instructions to implement the most impactful fixes.

---

## 🔴 PRIORITY 1: Logging Consolidation (2-3 hours)

### Current Problem

20+ `console.log` statements scattered in `backend/routes/auth.js` and other files, while a `logger` utility exists but isn't used.

### Files to Fix

- `backend/routes/auth.js` (18 console.logs)
- `backend/routes/course.js` (minimal)
- `backend/server.js` (2 console.logs)
- `backend/utils/seedAdmin.js` (2 console.logs)

### Implementation Steps

#### Step 1: Verify Logger is Available

✅ Already exists at `backend/utils/logger.js`

#### Step 2: Import Logger in Files

```javascript
// Add to top of each route file
const logger = require("../utils/logger");
```

#### Step 3: Replace Patterns

**Pattern 1: Info Logs**

```javascript
// BEFORE
console.log(`Login attempt for: ${username}`);

// AFTER
logger.info("Login attempt", { username });
```

**Pattern 2: Error Logs**

```javascript
// BEFORE
console.log("User not found in toggle");

// AFTER
logger.error("User not found in toggle", { userId: req.user._id });
```

**Pattern 3: Debug Logs**

```javascript
// BEFORE
console.log(`Toggle hidden content: course=${courseId}, content=${contentId}`);

// AFTER
logger.debug("Toggle hidden content", { courseId, contentId });
```

### Quick Wins

- Use global find/replace in VS Code
- Search: `console\.log\(`
- Most can be converted to `logger.info()` or `logger.debug()`

#### Example Replacements Needed:

**In `backend/routes/auth.js`:**

```javascript
// Line 17: console.log(`Toggle hidden content...`)
logger.debug("Toggle hidden content", { courseId, contentId });

// Line 22: console.log('User not found in toggle')
logger.error("User not found in toggle", { userId: req.user._id });

// Line 75: console.log(`Login attempt for: ${username}`)
logger.info("Login attempt", { username });

// Line 80: console.log(`Invalid format for: ${username}`)
logger.error("Invalid username format", { username });

// Line 88: console.log(`User not found: ${username}...`)
logger.error("User authentication failed", { username, role });

// Line 100: console.log(`Login successful: ${username}`)
logger.info("User login successful", { username });
```

---

## 🔴 PRIORITY 2: Standardize Error Handling (3-4 hours)

### Current Problem

Error handling is inconsistent across components and pages.

### Create Error Interceptor

**File: `frontend/src/api/interceptor.js` (NEW)**

```javascript
import { showToast } from "../utils/toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Centralized error handler for all API requests
 */
export const handleApiError = (error, customMessage = null) => {
  // Network error
  if (!error.response) {
    showToast.error(
      customMessage || "Network error. Please check your connection.",
    );
    return;
  }

  const status = error.response.status;
  const data = error.response.data;
  const message = data?.error?.message || data?.error || data?.message;

  // Handle specific status codes
  switch (status) {
    case 401:
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
      break;
    case 403:
      showToast.error("You do not have permission for this action.");
      break;
    case 404:
      showToast.error(message || "Resource not found.");
      break;
    case 429:
      showToast.error("Too many requests. Please try again later.");
      break;
    case 500:
      showToast.error(message || "Server error. Please try again later.");
      break;
    default:
      showToast.error(customMessage || message || "An error occurred.");
  }
};

/**
 * Wrapper for fetch with automatic retries
 */
export const fetchWithRetry = async (url, options = {}, retries = 3) => {
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...options.headers, ...getHeaders() },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### Update API Module

**File: `frontend/src/api/api.js` - Import and use**

```javascript
import { handleApiError, fetchWithRetry } from "./interceptor";

// Update existing functions
export const loginUser = async (username, password) => {
  try {
    const response = await fetchWithRetry(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
  } catch (err) {
    handleApiError(err, "Login failed");
    throw err;
  }
};

// Similar pattern for other functions...
```

---

## 🔴 PRIORITY 3: Enhance Auth Context (3-4 hours)

### Current Problem

Auth state isn't persisting user information or handling token refresh.

**File: `frontend/src/context/AuthContext.jsx` (UPDATE)**

```javascript
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { fetchCurrentUser } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Initialize auth on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          setToken(savedToken);
          // Verify token is still valid
          const userData = await fetchCurrentUser();
          setUser(userData.data || userData);
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### Update API Module to Use Auth Context

```javascript
// Update getHeaders to use context's token if needed
import { useAuth } from "../context/AuthContext";

// In components:
const { token } = useAuth();
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
```

---

## 📋 Implementation Checklist

### Week 1: Logging & Error Handling

- [ ] Replace all console.log with logger in auth.js
- [ ] Replace console.log in course.js, server.js, seedAdmin.js
- [ ] Create interceptor.js for frontend
- [ ] Update api.js functions to use error handler
- [ ] Test error handling across pages

### Week 2: Auth Context & Validation

- [ ] Update AuthContext with initialization
- [ ] Add token refresh logic
- [ ] Add frontend validation
- [ ] Test auth flow end-to-end

### Week 3+: Complete Partial Features

- [ ] Finish password reset (email sending)
- [ ] Add quiz grading UI
- [ ] Add content hiding/visibility UI
- [ ] Add freeze/unfreeze UI

---

## ✅ Testing Your Changes

### Test Logging

```bash
# Start server
cd backend
npm run dev

# Make a login request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@admin","password":"Test@1234"}'

# Check console output - should see structured logs
```

### Test Error Handling

```javascript
// In frontend, trigger an error
try {
  await fetchCourses(999); // Invalid page
} catch (err) {
  handleApiError(err, "Failed to load courses");
}

// Should show toast notification
```

### Test Auth Context

```javascript
// In component
const { user, loading, isAuthenticated } = useAuth();

if (loading) return <div>Loading...</div>;
if (!isAuthenticated) return <Navigate to="/login" />;

// Should persist on page refresh
```

---

## 🎯 Success Criteria

### Logging Consolidation ✅

- [ ] All console.log replaced with logger
- [ ] Structured logs with context data
- [ ] Log levels used appropriately
- [ ] No mixed logging approaches

### Error Handling ✅

- [ ] Consistent error messages across pages
- [ ] Automatic retry on network failures
- [ ] Proper status code handling
- [ ] User-friendly error messages

### Auth Context ✅

- [ ] User data persists on page refresh
- [ ] Token validation on app load
- [ ] Logout clears all data
- [ ] Unauthorized redirects to login

---

## 📝 Notes

- These are the **highest priority** fixes with most impact
- Total estimated time: **8-10 hours**
- After completing these, move to Priority 2 fixes
- Each change is relatively isolated and low-risk
- Test thoroughly after each change

---

**Ready to implement? Let me know which fix to start with first!**
