/**
 * Frontend Constants
 * Centralized place for frontend constants
 */

// API Response Status
const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending'
};

// User Roles (must match backend)
const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Common Error Messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  FETCH_FAILED: 'Failed to load data.',
  OPERATION_FAILED: 'Operation failed.',
  PLEASE_TRY_AGAIN: 'Something went wrong. Please try again.'
};

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  COURSE_FULL: '/courses/:id/full',
  
  // Chapters
  CHAPTERS: '/courses/:id/chapters',
  
  // Quizzes
  QUIZZES: '/quizzes'
};

// Local Storage Keys
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Cache Keys
const CACHE_KEYS = {
  COURSES: 'courses_cache',
  USER_DATA: 'user_data_cache',
  SETTINGS: 'settings_cache'
};

export {
  API_STATUS,
  USER_ROLES,
  ERROR_MESSAGES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  CACHE_KEYS
};
