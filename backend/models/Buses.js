import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const BusSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  route: { type: String },
  driverName: { type: String },
  status: { type: String, default: 'active' },
  streamurl: { type: String },
  stops: [StopSchema],
  createdAt: { type: Date, default: Date.now }
});

// ✅ Prevent OverwriteModelError
const Bus = mongoose.models.Bus || mongoose.model('Bus', BusSchema);
export default Bus;
