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

// ✅ Signup route (only allowed if no admin exists)
router.post('/signup', async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const existingAdmins = await Admin.countDocuments();
    if (existingAdmins > 0) {
      return res.status(403).json({ error: 'Signup not allowed. Admin already exists.' });
    }

    const { email, password } = req.body;
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

// ✅ Unified route to check if logged in + whether signup is allowed
router.get('/me', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.status(200).json({
      authenticated: req.isAuthenticated(),
      allowSignup: adminCount === 0,
      admin: req.user || null
    });
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
