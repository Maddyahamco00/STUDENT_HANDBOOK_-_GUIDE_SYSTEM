// filepath: backend/routes/handbook.js
const express = require('express');
const router = express.Router();
const handbookController = require('../controllers/handbookController');

// Student routes
router.get('/', handbookController.getHandbookList);
router.get('/:id', handbookController.getHandbookView);

// Admin routes (protected)
router.get('/create', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.getCreateHandbook(req, res);
});
router.post('/create', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.postCreateHandbook(req, res);
});

router.get('/:id/edit', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.getEditHandbook(req, res);
});
router.post('/:id/edit', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.postEditHandbook(req, res);
});

router.post('/:id/delete', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.deleteHandbook(req, res);
});

// Section management
router.get('/:id/section/create', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.getCreateSection(req, res);
});
router.post('/:id/section/create', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.postCreateSection(req, res);
});

router.get('/:id/section/:sectionId/edit', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.getEditSection(req, res);
});
router.post('/:id/section/:sectionId/edit', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.postEditSection(req, res);
});

router.post('/:id/section/:sectionId/delete', (req, res) => {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin')) {
    return res.status(403).redirect('/');
  }
  handbookController.deleteSection(req, res);
});

module.exports = router;