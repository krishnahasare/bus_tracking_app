import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import attendanceRoutes from './routes/attendance.js';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust if needed)
app.use(express.json()); // To parse JSON request bodies

// MongoDB connection string — replace with your ow nURI
const MONGO_URI = 'mongodb://localhost:27017/bus-tracker';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/attendance', attendanceRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Bus Tracker Backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
