import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import attendanceRoutes from './routes/attendance.js';
import busLocationRoutes from './routes/buslocation.js';
import NotificationRoutes from './routes/Notification.js';
import adminAuthRoutes from './routes/adminAuth.js';
import Admin from './models/Admin.js';

dotenv.config();
const app = express();

// ✅ Updated CORS setup: allow both local + deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://bus-tracking-app-wt0f.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Session + Passport setup
app.use(session({
  secret: 'admin-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// ✅ Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// ✅ API Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/', busLocationRoutes);
app.use('/api/alerts', NotificationRoutes);
app.use('/api/admin', adminAuthRoutes);

// ✅ Serve frontend (React build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../backend/dist');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} - http://localhost:${PORT}`);
});
