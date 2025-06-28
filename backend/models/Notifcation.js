import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  busId: { type: String, required: true },
  type: {
    type: String,
    enum: ['GeoFence', 'Delay', 'Idle', 'Emergency', 'SpeedViolation'],
    required: true,
  },
  message: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['unread', 'read', 'resolved'],
    default: 'unread',
  },
  audience: [{ type: String, enum: ['admin', 'parent', 'student'] }],
  severity: {
    type: String,
    enum: ['info', 'warning', 'danger'],
    default: 'info',
  },
});

export default mongoose.model('Notification', notificationSchema);
