/**
 * Error Handler Utility
 * Provides standardized error handling and response formatting
 */

const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

/**
 * Standard error response format
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create standardized error response
 */
const createErrorResponse = (message, statusCode = 500, details = null) => {
  return {
    success: false,
    statusCode,
    error: {
      message,
      ...(details && { details })
    }
  };
};

/**
 * Create standardized success response
 */
const createSuccessResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data
  };
};

/**
 * Global error handler middleware
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;
  
  // Log error
  console.error({
    timestamp: new Date().toISOString(),
    statusCode,
    message,
    url: req.originalUrl,
    method: req.method,
    stack: err.stack
  });
  
  // Send error response
  res.status(statusCode).json(createErrorResponse(message, statusCode));
};

/**
 * Wrapper for async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validate required fields in request
 */
const validateRequiredFields = (obj, requiredFields) => {
  const missing = requiredFields.filter(field => !obj[field]);
  if (missing.length > 0) {
    throw new AppError(
      `Missing required fields: ${missing.join(', ')}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }
};

module.exports = {
  AppError,
  createErrorResponse,
  createSuccessResponse,
  errorHandlerMiddleware,
  asyncHandler,
  validateRequiredFields
};
