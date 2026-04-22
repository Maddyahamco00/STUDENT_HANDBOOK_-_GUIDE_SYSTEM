// filepath: backend/controllers/handbookController.js
const Handbook = require('../models/Handbook');
const HandbookSection = require('../models/HandbookSection');

exports.getHandbookList = async (req, res) => {
  try {
    const institutionId = req.session.user.institution_id;
    const handbooks = await Handbook.findByInstitution(institutionId);
    res.render('handbook/list', { handbooks, user: req.session.user });
  } catch (err) {
    console.error('Error fetching handbooks:', err);
    res.render('error', { message: 'Failed to load handbooks', error: err });
  }
};

exports.getHandbookView = async (req, res) => {
  try {
    const handbook = await Handbook.findById(req.params.id);
    
    if (!handbook) {
      return res.status(404).render('error', { message: 'Handbook not found', error: {} });
    }

    // Check access permission
    if (handbook.institution_id !== req.session.user.institution_id && req.session.user.role !== 'super_admin') {
      return res.status(403).render('error', { message: 'Access denied', error: {} });
    }

    const sections = await HandbookSection.findByHandbook(req.params.id);
    res.render('handbook/view', { handbook, sections, user: req.session.user });
  } catch (err) {
    console.error('Error viewing handbook:', err);
    res.render('error', { message: 'Failed to load handbook', error: err });
  }
};

// Admin functions
exports.getCreateHandbook = (req, res) => {
  res.render('handbook/create', { user: req.session.user, error: null });
};

exports.postCreateHandbook = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.render('handbook/create', { user: req.session.user, error: 'Title is required' });
    }

    await Handbook.create({
      title,
      description,
      institution_id: req.session.user.institution_id
    });

    res.redirect('/admin/handbooks');
  } catch (err) {
    console.error('Error creating handbook:', err);
    res.render('handbook/create', { user: req.session.user, error: 'Failed to create handbook' });
  }
};

exports.getEditHandbook = async (req, res) => {
  try {
    const handbook = await Handbook.findById(req.params.id);
    
    if (!handbook) {
      return res.status(404).render('error', { message: 'Handbook not found', error: {} });
    }

    res.render('handbook/edit', { handbook, user: req.session.user, error: null });
  } catch (err) {
    console.error('Error loading handbook:', err);
    res.render('error', { message: 'Failed to load handbook', error: err });
  }
};

exports.postEditHandbook = async (req, res) => {
  try {
    const { title, description } = req.body;

    await Handbook.update(req.params.id, { title, description });
    res.redirect(`/handbook/${req.params.id}`);
  } catch (err) {
    console.error('Error updating handbook:', err);
    const handbook = await Handbook.findById(req.params.id);
    res.render('handbook/edit', { handbook, user: req.session.user, error: 'Failed to update handbook' });
  }
};

exports.deleteHandbook = async (req, res) => {
  try {
    await Handbook.delete(req.params.id);
    res.redirect('/admin/handbooks');
  } catch (err) {
    console.error('Error deleting handbook:', err);
    res.redirect('/admin/handbooks');
  }
};

// Section management
exports.getCreateSection = async (req, res) => {
  try {
    const handbook = await Handbook.findById(req.params.id);
    res.render('handbook/section-create', { handbook, user: req.session.user, error: null });
  } catch (err) {
    res.render('error', { message: 'Failed to load handbook', error: err });
  }
};

exports.postCreateSection = async (req, res) => {
  try {
    const { title, content, section_order } = req.body;

    await HandbookSection.create({
      handbook_id: req.params.id,
      title,
      content,
      section_order: section_order || 0
    });

    res.redirect(`/handbook/${req.params.id}`);
  } catch (err) {
    console.error('Error creating section:', err);
    const handbook = await Handbook.findById(req.params.id);
    res.render('handbook/section-create', { handbook, user: req.session.user, error: 'Failed to create section' });
  }
};

exports.getEditSection = async (req, res) => {
  try {
    const section = await HandbookSection.findById(req.params.sectionId);
    const handbook = await Handbook.findById(req.params.id);
    res.render('handbook/section-edit', { handbook, section, user: req.session.user, error: null });
  } catch (err) {
    res.render('error', { message: 'Failed to load section', error: err });
  }
};

exports.postEditSection = async (req, res) => {
  try {
    const { title, content, section_order } = req.body;

    await HandbookSection.update(req.params.sectionId, {
      title,
      content,
      section_order: section_order || 0
    });

    res.redirect(`/handbook/${req.params.id}`);
  } catch (err) {
    console.error('Error updating section:', err);
    res.redirect(`/handbook/${req.params.id}`);
  }
};

exports.deleteSection = async (req, res) => {
  try {
    await HandbookSection.delete(req.params.sectionId);
    res.redirect(`/handbook/${req.params.id}`);
  } catch (err) {
    console.error('Error deleting section:', err);
    res.redirect(`/handbook/${req.params.id}`);
  }
};