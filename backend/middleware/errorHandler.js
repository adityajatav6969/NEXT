/**
 * Global error handler middleware
 * Catches all unhandled errors and returns a consistent JSON response
 */
export const errorHandler = (err, req, res, next) => {
  void next;
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with those details already exists';
  }

  const response = {
    message: statusCode >= 500 && process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack || err.message);

  res.status(statusCode).json(response);
};

/**
 * 404 handler for unknown routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
