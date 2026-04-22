// filepath: backend/server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const handbookRoutes = require('./routes/handbook');
const registrationRoutes = require('./routes/registration');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || '15823049f52e77040f11cb660d5d7e88f3fa7c5c3ed912cdf07dc57e60f313b748c5490b2e33b55dc8348f30fa539eb4d60cdb8395f0b28c0abdb1619c3ccf96',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Routes
app.use('/auth', authRoutes);
app.use('/handbook', handbookRoutes);
app.use('/registration', registrationRoutes);
app.use('/admin', adminRoutes);
app.use('/dashboard', dashboardRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home', { user: req.session.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Page not found',
    error: {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;