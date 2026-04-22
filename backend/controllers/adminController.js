// filepath: backend/controllers/adminController.js
const User = require('../models/User');
const Institution = require('../models/Institution');
const Handbook = require('../models/Handbook');
const HandbookSection = require('../models/HandbookSection');
const RegistrationStep = require('../models/RegistrationStep');
const Announcement = require('../models/Announcement');

// Middleware to check admin role
exports.requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  if (req.session.user.role !== 'admin' && req.session.user.role !== 'super_admin') {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }
  next();
};

exports.getDashboard = async (req, res) => {
  try {
    const institutionId = req.session.user.institution_id;
    
    // Get stats
    let users = [];
    if (req.session.user.role === 'super_admin') {
      users = await User.getAll();
    } else {
      users = await User.getAll(institutionId);
    }

    const handbooks = await Handbook.findByInstitution(institutionId);
    const steps = await RegistrationStep.findByInstitution(institutionId);
    const announcements = await Announcement.findByInstitution(institutionId, 5);

    const stats = {
      totalUsers: users.length,
      totalHandbooks: handbooks.length,
      totalSteps: steps.length,
      totalAnnouncements: announcements.length
    };

    res.render('admin/dashboard', { 
      stats,
      recentAnnouncements: announcements,
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error loading admin dashboard:', err);
    res.render('error', { message: 'Failed to load dashboard', error: err });
  }
};

// Institution management (Super Admin only)
exports.getInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.findAll();
    res.render('admin/institutions', { institutions, user: req.session.user });
  } catch (err) {
    res.render('error', { message: 'Failed to load institutions', error: err });
  }
};

exports.getCreateInstitution = (req, res) => {
  res.render('admin/institution-create', { user: req.session.user, error: null });
};

exports.postCreateInstitution = async (req, res) => {
  try {
    const { name, location, contact_email, phone } = req.body;
    await Institution.create({ name, location, contact_email, phone });
    res.redirect('/admin/institutions');
  } catch (err) {
    res.render('admin/institution-create', { user: req.session.user, error: 'Failed to create institution' });
  }
};

// User management
exports.getUsers = async (req, res) => {
  try {
    const institutionId = req.session.user.role === 'super_admin' ? null : req.session.user.institution_id;
    const users = await User.getAll(institutionId);
    res.render('admin/users', { users, user: req.session.user });
  } catch (err) {
    res.render('error', { message: 'Failed to load users', error: err });
  }
};

// Handbook management
exports.getHandbooks = async (req, res) => {
  try {
    const institutionId = req.session.user.institution_id;
    const handbooks = await Handbook.findByInstitution(institutionId);
    res.render('admin/handbooks', { handbooks, user: req.session.user });
  } catch (err) {
    res.render('error', { message: 'Failed to load handbooks', error: err });
  }
};

// Registration steps management
exports.getRegistrationSteps = async (req, res) => {
  try {
    const institutionId = req.session.user.institution_id;
    const steps = await RegistrationStep.findByInstitution(institutionId);
    res.render('admin/registration-steps', { steps, user: req.session.user });
  } catch (err) {
    res.render('error', { message: 'Failed to load steps', error: err });
  }
};

// Announcement management
exports.getAnnouncements = async (req, res) => {
  try {
    const institutionId = req.session.user.institution_id;
    const announcements = await Announcement.findByInstitution(institutionId);
    res.render('admin/announcements', { announcements, user: req.session.user });
  } catch (err) {
    res.render('error', { message: 'Failed to load announcements', error: err });
  }
};

exports.getCreateAnnouncement = (req, res) => {
  res.render('admin/announcement-create', { user: req.session.user, error: null });
};

exports.postCreateAnnouncement = async (req, res) => {
  try {
    const { title, message, deadline } = req.body;
    await Announcement.create({
      title,
      message,
      deadline: deadline || null,
      institution_id: req.session.user.institution_id
    });
    res.redirect('/admin/announcements');
  } catch (err) {
    res.render('admin/announcement-create', { user: req.session.user, error: 'Failed to create announcement' });
  }
};

exports.postDeleteAnnouncement = async (req, res) => {
  try {
    await Announcement.delete(req.params.id);
    res.redirect('/admin/announcements');
  } catch (err) {
    res.redirect('/admin/announcements');
  }
};