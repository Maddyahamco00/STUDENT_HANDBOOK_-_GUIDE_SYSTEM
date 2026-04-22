// filepath: backend/routes/registration.js
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Student routes
router.get('/steps', registrationController.getRegistrationSteps);
router.post('/steps/:stepId/update', registrationController.updateStepStatus);
router.get('/progress', registrationController.getProgressStats);

// Admin routes (protected)
router.get('/steps/create', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  registrationController.getCreateStep(req, res);
});
router.post('/steps/create', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  registrationController.postCreateStep(req, res);
});

router.get('/steps/:id/edit', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  registrationController.getEditStep(req, res);
});
router.post('/steps/:id/edit', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  registrationController.postEditStep(req, res);
});

router.post('/steps/:id/delete', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  registrationController.deleteStep(req, res);
});

module.exports = router;