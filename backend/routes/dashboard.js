// filepath: backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Apply auth middleware to all routes
router.use(requireAuth);

router.get('/', dashboardController.getDashboard);
router.get('/profile', dashboardController.getProfile);
router.post('/profile', dashboardController.updateProfile);

module.exports = router;