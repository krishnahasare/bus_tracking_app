import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const BusSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  name: { type: String, required: true },      // e.g. "Bus 101"
  route: { type: String },                     // e.g. "Route A"
  driverName: { type: String },                // optional
  status: { type: String, default: 'active' }, // active/inactive/offline
  stops: [StopSchema],                         // 👈 Add stop name + coordinates
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bus', BusSchema);
