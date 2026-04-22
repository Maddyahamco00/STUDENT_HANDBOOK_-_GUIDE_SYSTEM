// filepath: backend/controllers/registrationController.js
const RegistrationStep = require('../models/RegistrationStep');
const StudentProgress = require('../models/StudentProgress');
const Announcement = require('../models/Announcement');

exports.getRegistrationSteps = async (req, res) => {
  try {
    const institutionId = req.session.user.institution_id;
    const steps = await RegistrationStep.findByInstitution(institutionId);
    const progress = await StudentProgress.findByUser(req.session.user.id);
    const announcements = await Announcement.findActive(institutionId);

    // Map progress to steps
    const stepsWithProgress = steps.map(step => {
      const userProgress = progress.find(p => p.step_id === step.id);
      return {
        ...step,
        status: userProgress ? userProgress.status : 'pending',
        document_path: userProgress ? userProgress.document_path : null,
        completed_at: userProgress ? userProgress.completed_at : null
      };
    });

    res.render('registration/steps', { 
      steps: stepsWithProgress, 
      announcements,
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error fetching registration steps:', err);
    res.render('error', { message: 'Failed to load registration steps', error: err });
  }
};

exports.updateStepStatus = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { status } = req.body;

    await StudentProgress.updateStatus(req.session.user.id, stepId, status);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating step status:', err);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

exports.getProgressStats = async (req, res) => {
  try {
    const stats = await StudentProgress.getProgressStats(req.session.user.id);
    res.json(stats);
  } catch (err) {
    console.error('Error fetching progress stats:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// Admin functions
exports.getCreateStep = (req, res) => {
  res.render('registration/step-create', { user: req.session.user, error: null });
};

exports.postCreateStep = async (req, res) => {
  try {
    const { title, description, required_documents, deadline, step_order } = req.body;

    if (!title) {
      return res.render('registration/step-create', { user: req.session.user, error: 'Title is required' });
    }

    await RegistrationStep.create({
      title,
      description,
      required_documents,
      deadline: deadline || null,
      step_order: step_order || 0,
      institution_id: req.session.user.institution_id
    });

    res.redirect('/admin/registration-steps');
  } catch (err) {
    console.error('Error creating step:', err);
    res.render('registration/step-create', { user: req.session.user, error: 'Failed to create step' });
  }
};

exports.getEditStep = async (req, res) => {
  try {
    const step = await RegistrationStep.findById(req.params.id);
    res.render('registration/step-edit', { step, user: req.session.user, error: null });
  } catch (err) {
    res.render('error', { message: 'Failed to load step', error: err });
  }
};

exports.postEditStep = async (req, res) => {
  try {
    const { title, description, required_documents, deadline, step_order } = req.body;

    await RegistrationStep.update(req.params.id, {
      title,
      description,
      required_documents,
      deadline: deadline || null,
      step_order: step_order || 0
    });

    res.redirect('/admin/registration-steps');
  } catch (err) {
    console.error('Error updating step:', err);
    res.redirect('/admin/registration-steps');
  }
};

exports.deleteStep = async (req, res) => {
  try {
    await RegistrationStep.delete(req.params.id);
    res.redirect('/admin/registration-steps');
  } catch (err) {
    console.error('Error deleting step:', err);
    res.redirect('/admin/registration-steps');
  }
};