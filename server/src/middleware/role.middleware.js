import { ApiError } from '../utils/ApiError.js';

/**
 * Role-based access guard. Use after `authenticate`.
 * Example: router.get('/admin', authenticate, authorize('admin'), handler)
 */
export const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }
  if (!allowedRoles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to access this resource'));
  }
  return next();
};
