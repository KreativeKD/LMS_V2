/**
 * Form Validation Utilities
 * Centralized validation rules and helpers for consistent client-side validation
 */

// Validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/,
  phone: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

// Validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  username: 'Username must be 3-20 characters, alphanumeric with - or _',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  passwordMismatch: 'Passwords do not match',
  phone: 'Please enter a valid phone number',
  minLength: (min) => `Minimum ${min} characters required`,
  maxLength: (max) => `Maximum ${max} characters allowed`,
  url: 'Please enter a valid URL',
  noSpaces: 'This field cannot contain spaces',
  numbersOnly: 'This field must contain only numbers',
  noSpecialChars: 'Special characters are not allowed',
};

/**
 * Validates email format
 */
export const validateEmail = (email) => {
  if (!email) return VALIDATION_MESSAGES.required;
  if (!VALIDATION_PATTERNS.email.test(email)) return VALIDATION_MESSAGES.email;
  return '';
};

/**
 * Validates password strength
 */
export const validatePassword = (password) => {
  if (!password) return VALIDATION_MESSAGES.required;
  if (password.length < 6) return VALIDATION_MESSAGES.minLength(6);
  // Optional: enforce strong password
  // if (!VALIDATION_PATTERNS.password.test(password)) return VALIDATION_MESSAGES.password;
  return '';
};

/**
 * Validates password confirmation
 */
export const validatePasswordMatch = (password, confirmation) => {
  if (!confirmation) return VALIDATION_MESSAGES.required;
  if (password !== confirmation) return VALIDATION_MESSAGES.passwordMismatch;
  return '';
};

/**
 * Validates username
 */
export const validateUsername = (username) => {
  if (!username) return VALIDATION_MESSAGES.required;
  if (username.length < 3) return VALIDATION_MESSAGES.minLength(3);
  if (username.length > 20) return VALIDATION_MESSAGES.maxLength(20);
  return '';
};

/**
 * Validates required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Validates minimum length
 */
export const validateMinLength = (value, min, fieldName = 'This field') => {
  if (!value) return '';
  if (value.length < min) return `${fieldName} must be at least ${min} characters`;
  return '';
};

/**
 * Validates maximum length
 */
export const validateMaxLength = (value, max, fieldName = 'This field') => {
  if (!value) return '';
  if (value.length > max) return `${fieldName} must be at most ${max} characters`;
  return '';
};

/**
 * Validates URL format
 */
export const validateUrl = (url) => {
  if (!url) return '';
  if (!VALIDATION_PATTERNS.url.test(url)) return VALIDATION_MESSAGES.url;
  return '';
};

/**
 * Validates phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return '';
  if (!VALIDATION_PATTERNS.phone.test(phone)) return VALIDATION_MESSAGES.phone;
  return '';
};

/**
 * Validates that value contains only numbers
 */
export const validateNumbersOnly = (value, fieldName = 'This field') => {
  if (!value) return '';
  if (!/^\d+$/.test(value)) return `${fieldName} must contain only numbers`;
  return '';
};

/**
 * Validates that value has no spaces
 */
export const validateNoSpaces = (value, fieldName = 'This field') => {
  if (!value) return '';
  if (/\s/.test(value)) return `${fieldName} cannot contain spaces`;
  return '';
};

/**
 * Form validation hook for use with react-hook-form
 * Returns validation rules for common field types
 */
export const getValidationRules = (type = 'text', options = {}) => {
  const {
    required = true,
    minLength = null,
    maxLength = null,
    pattern = null,
    custom = null,
  } = options;

  const rules = {};

  if (required) {
    rules.required = VALIDATION_MESSAGES.required;
  }

  if (minLength) {
    rules.minLength = {
      value: minLength,
      message: VALIDATION_MESSAGES.minLength(minLength),
    };
  }

  if (maxLength) {
    rules.maxLength = {
      value: maxLength,
      message: VALIDATION_MESSAGES.maxLength(maxLength),
    };
  }

  if (type === 'email') {
    rules.pattern = {
      value: VALIDATION_PATTERNS.email,
      message: VALIDATION_MESSAGES.email,
    };
  } else if (type === 'url') {
    rules.pattern = {
      value: VALIDATION_PATTERNS.url,
      message: VALIDATION_MESSAGES.url,
    };
  } else if (type === 'phone') {
    rules.pattern = {
      value: VALIDATION_PATTERNS.phone,
      message: VALIDATION_MESSAGES.phone,
    };
  } else if (pattern) {
    rules.pattern = {
      value: pattern,
      message: custom || 'Invalid format',
    };
  }

  return rules;
};

export default {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateUsername,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateUrl,
  validatePhone,
  validateNumbersOnly,
  validateNoSpaces,
  getValidationRules,
};
