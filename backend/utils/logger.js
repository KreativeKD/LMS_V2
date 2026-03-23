/**
 * Logging Utility
 * Provides structured logging using Node's built-in console with formatting
 * (Can be replaced with Winston or Pino in production)
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format log message with timestamp and level
 */
const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    ...data
  };
};

/**
 * Logger object with methods for different log levels
 */
const logger = {
  error: (message, data = {}) => {
    const log = formatLog(LOG_LEVELS.ERROR, message, data);
    console.error(JSON.stringify(log));
  },

  warn: (message, data = {}) => {
    const log = formatLog(LOG_LEVELS.WARN, message, data);
    console.warn(JSON.stringify(log));
  },

  info: (message, data = {}) => {
    const log = formatLog(LOG_LEVELS.INFO, message, data);
    console.log(JSON.stringify(log));
  },

  debug: (message, data = {}) => {
    const log = formatLog(LOG_LEVELS.DEBUG, message, data);
    console.log(JSON.stringify(log));
  },

  // Request logging middleware
  requestLogger: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('HTTP Request', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userId: req.user?._id || 'anonymous'
      });
    });
    
    next();
  },

  // Database query logging
  queryLogger: (query, duration) => {
    logger.debug('Database Query', {
      query: query.toString(),
      duration: `${duration}ms`
    });
  }
};

module.exports = logger;
