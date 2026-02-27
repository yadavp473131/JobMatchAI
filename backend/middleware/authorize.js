/**
 * Authorization middleware - Restricts access based on user roles
 * @param  {...String} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource requires one of the following roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * Check if user owns the resource
 * @param {Function} getResourceOwnerId - Function to extract owner ID from request
 */
const authorizeOwner = (getResourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const ownerId = getResourceOwnerId(req);

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is the owner
    if (req.user._id.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resource.',
      });
    }

    next();
  };
};

/**
 * Check if user is owner OR has specific role
 * @param {Function} getResourceOwnerId - Function to extract owner ID from request
 * @param  {...String} roles - Allowed roles
 */
const authorizeOwnerOrRole = (getResourceOwnerId, ...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const ownerId = getResourceOwnerId(req);

    // Check if user has required role
    if (roles.includes(req.user.role)) {
      return next();
    }

    // Check if user is the owner
    if (req.user._id.toString() === ownerId.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  };
};

module.exports = {
  authorize,
  authorizeOwner,
  authorizeOwnerOrRole,
};
