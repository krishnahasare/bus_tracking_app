import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import attendanceRoutes from './routes/attendance.js';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));


app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} - http://localhost:${PORT}`);
});
