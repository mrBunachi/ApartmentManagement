/**
 * Role-based access control middleware
 * Kiểm tra vai trò của user trước khi cho phép truy cập route
 */

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.VAITRO;
    
    if (!userRole) {
      return res.status(403).json({ 
        message: "Không xác định được vai trò người dùng" 
      });
    }
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Chỉ ${allowedRoles.join(', ')} mới có quyền truy cập chức năng này`,
        requiredRoles: allowedRoles,
        yourRole: userRole
      });
    }
    
    next();
  };
};

module.exports = { requireRole };
