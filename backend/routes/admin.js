// filepath: backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  if (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin') {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }
  next();
};

// Apply admin middleware to all routes
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Institution management (Super Admin only)
router.get('/institutions', (req, res, next) => {
  if (req.session.user.role !== 'super_admin') {
    return res.status(403).redirect('/admin/dashboard');
  }
  adminController.getInstitutions(req, res);
});

router.get('/institutions/create', (req, res, next) => {
  if (req.session.user.role !== 'super_admin') {
    return res.status(403).redirect('/admin/dashboard');
  }
  adminController.getCreateInstitution(req, res);
});

router.post('/institutions/create', (req, res, next) => {
  if (req.session.user.role !== 'super_admin') {
    return res.status(403).redirect('/admin/dashboard');
  }
  adminController.postCreateInstitution(req, res);
});

// User management
router.get('/users', adminController.getUsers);

// Handbook management
router.get('/handbooks', adminController.getHandbooks);

// Registration steps management
router.get('/registration-steps', adminController.getRegistrationSteps);

// Announcement management
router.get('/announcements', adminController.getAnnouncements);
router.get('/announcements/create', adminController.getCreateAnnouncement);
router.post('/announcements/create', adminController.postCreateAnnouncement);
router.post('/announcements/:id/delete', adminController.postDeleteAnnouncement);

module.exports = router;