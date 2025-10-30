// Role-based access control middleware

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Specific role checkers
const requireCompany = checkRole(['company']);
const requireProvider = checkRole(['provider']);
const requireCraftworker = checkRole(['craftworker']);
const requireCompanyOrProvider = checkRole(['company', 'provider']);
const requireProviderOrCraftworker = checkRole(['provider', 'craftworker']);

// Check if user can access resource (owns it)
const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get the resource user ID from params or body
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (!resourceUserId) {
      return res.status(400).json({
        success: false,
        message: 'Resource user ID not provided'
      });
    }

    // Check if user owns the resource
    if (req.user.id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

module.exports = {
  checkRole,
  requireCompany,
  requireProvider,
  requireCraftworker,
  requireCompanyOrProvider,
  requireProviderOrCraftworker,
  checkResourceOwnership
};
