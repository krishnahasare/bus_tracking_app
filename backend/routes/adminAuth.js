import express from 'express';
import passport from 'passport';
import Joi from 'joi';
import Admin from '../models/Admin.js';

const router = express.Router();

// ✅ Joi validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// ✅ 🔓 Signup route (allows multiple admins)
router.post('/signup', async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Admin with this email already exists.' });
    }

    const admin = new Admin({ email });
    await Admin.register(admin, password);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Login route
router.post('/login', (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  passport.authenticate('local', (err, admin) => {
    if (err || !admin) return res.status(400).json({ error: 'Invalid credentials' });

    req.logIn(admin, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      res.status(200).json({ message: 'Login successful', admin: { email: admin.email } });
    });
  })(req, res, next);
});

// ✅ Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// ✅ /me route: check if logged in and user info
router.get('/me', async (req, res) => {
  try {
    res.status(200).json({
      authenticated: req.isAuthenticated(),
      admin: req.user || null
    });
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
