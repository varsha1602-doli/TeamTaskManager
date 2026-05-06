const AppError = require('../utils/AppError');

/**
 * Role-based authorization middleware.
 * Usage: authorize('ADMIN') or authorize('ADMIN', 'MEMBER')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};

module.exports = authorize;
