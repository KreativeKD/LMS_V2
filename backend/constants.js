/**
 * Application Constants
 * Centralized place for all magic strings and constants
 */

// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid username or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid or missing token',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation failed',
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  
  // Resource errors
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  
  // Server errors
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error occurred',
  
  // Course/content errors
  COURSE_NOT_FOUND: 'Course not found',
  CHAPTER_NOT_FOUND: 'Chapter not found',
  UNIT_NOT_FOUND: 'Unit not found',
  QUIZ_NOT_FOUND: 'Quiz not found',
  
  // Enrollment errors
  NOT_ENROLLED: 'You are not enrolled in this course',
  ENROLLMENT_PENDING: 'Your enrollment request is pending approval',
  ALREADY_ENROLLED: 'You are already enrolled in this course',
  
  // Operation errors
  OPERATION_FAILED: 'Operation failed',
  FETCH_FAILED: 'Failed to fetch data',
  CREATE_FAILED: 'Failed to create resource',
  UPDATE_FAILED: 'Failed to update resource',
  DELETE_FAILED: 'Failed to delete resource'
};

// Success Messages
const SUCCESS_MESSAGES = {
  OPERATION_SUCCESS: 'Operation successful',
  CREATED_SUCCESS: 'Resource created successfully',
  UPDATED_SUCCESS: 'Resource updated successfully',
  DELETED_SUCCESS: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  ENROLLMENT_REQUESTED: 'Enrollment request submitted',
  ENROLLMENT_APPROVED: 'Enrollment approved',
  ENROLLMENT_REJECTED: 'Enrollment rejected'
};

// Pagination Defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// Cache Durations (in milliseconds)
const CACHE_DURATIONS = {
  COURSES_LIST: 5 * 60 * 1000,      // 5 minutes
  COURSE_DETAILS: 10 * 60 * 1000,   // 10 minutes
  USER_DATA: 15 * 60 * 1000,        // 15 minutes
  ENROLLMENT_REQUESTS: 3 * 60 * 1000 // 3 minutes
};

// Validation Patterns
const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^[0-9]{10}$/,
  URL: /^https?:\/\/.+/
};

module.exports = {
  USER_ROLES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  CACHE_DURATIONS,
  VALIDATION_PATTERNS
};
