const config = require('../config');
const logger = require('../utils/logger');

/**
 * Global error handler — catches all errors forwarded by next(error).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma known errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with that value already exists.';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
  }

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      path: req.originalUrl,
      method: req.method,
      stack: config.isProduction ? undefined : err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
