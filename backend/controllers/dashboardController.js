// filepath: backend/controllers/dashboardController.js
const StudentProgress = require('../models/StudentProgress');
const Handbook = require('../models/Handbook');
const Announcement = require('../models/Announcement');

exports.getDashboard = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const institutionId = req.session.user.institution_id;
    
    // Get progress stats
    const stats = await StudentProgress.getProgressStats(req.session.user.id);
    
    // Get recent handbooks
    const handbooks = await Handbook.findByInstitution(institutionId);
    
    // Get active announcements
    const announcements = await Announcement.findActive(institutionId);
    
    // Get user's progress
    const progress = await StudentProgress.findByUser(req.session.user.id);

    res.render('dashboard/index', {
      stats,
      handbooks: handbooks.slice(0, 3),
      announcements,
      progress,
      user: req.session.user
    });
  } catch (err) {
    console.error('Error loading student dashboard:', err);
    res.render('error', { message: 'Failed to load dashboard', error: err });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    res.render('dashboard/profile', { user: req.session.user, success: null, error: null });
  } catch (err) {
    res.render('error', { message: 'Failed to load profile', error: err });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const User = require('../models/User');
    const { name, email, current_password, new_password } = req.body;

    const user = await User.findById(req.session.user.id);

    // Verify current password if changing password
    if (new_password) {
      const isValid = await User.verifyPassword(current_password, user.password);
      if (!isValid) {
        return res.render('dashboard/profile', { 
          user: req.session.user, 
          success: null, 
          error: 'Current password is incorrect' 
        });
      }
      await User.update(req.session.user.id, { name, email, password: new_password });
    } else {
      await User.update(req.session.user.id, { name, email });
    }

    // Update session
    req.session.user.name = name;
    req.session.user.email = email;

    res.render('dashboard/profile', { 
      user: req.session.user, 
      success: 'Profile updated successfully', 
      error: null 
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.render('dashboard/profile', { 
      user: req.session.user, 
      success: null, 
      error: 'Failed to update profile' 
    });
  }
};