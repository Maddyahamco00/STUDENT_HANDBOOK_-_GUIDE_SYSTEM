// filepath: backend/controllers/authController.js
const User = require('../models/User');
const Institution = require('../models/Institution');

exports.getLogin = (req, res) => {
  res.render('auth/login', { error: null, user: req.session.user });
};

exports.getRegister = async (req, res) => {
  try {
    const institutions = await Institution.findAll();
    res.render('auth/register', { error: null, institutions, user: req.session.user });
  } catch (err) {
    res.render('auth/register', { error: 'Failed to load institutions', institutions: [], user: req.session.user });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('auth/login', { error: 'Please provide email and password', user: null });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password', user: null });
    }

    const isValid = await User.verifyPassword(password, user.password);

    if (!isValid) {
      return res.render('auth/login', { error: 'Invalid email or password', user: null });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      institution_id: user.institution_id
    };

    // Redirect based on role
    if (user.role === 'admin' || user.role === 'super_admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.render('auth/login', { error: 'An error occurred during login', user: null });
  }
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirm_password, institution_id, role } = req.body;

    if (!name || !email || !password || !confirm_password) {
      const institutions = await Institution.findAll();
      return res.render('auth/register', { error: 'All fields are required', institutions, user: null });
    }

    if (password !== confirm_password) {
      const institutions = await Institution.findAll();
      return res.render('auth/register', { error: 'Passwords do not match', institutions, user: null });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const institutions = await Institution.findAll();
      return res.render('auth/register', { error: 'Email already registered', institutions, user: null });
    }

    await User.create({
      name,
      email,
      password,
      role: role || 'student',
      institution_id: institution_id || null
    });

    res.redirect('/auth/login?registered=true');
  } catch (err) {
    console.error('Registration error:', err);
    const institutions = await Institution.findAll().catch(() => []);
    res.render('auth/register', { error: 'An error occurred during registration', institutions, user: null });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
};