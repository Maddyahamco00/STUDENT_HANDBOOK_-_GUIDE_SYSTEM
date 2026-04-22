// filepath: backend/middleware/auth.js
// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  if (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin') {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }
  next();
};

// Middleware to check if user is super admin
const requireSuperAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  if (req.session.user.role !== 'super_admin') {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }
  next();
};

// Middleware to pass user to all views
const locals = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
  locals
};