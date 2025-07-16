import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    index: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// ✅ Prevent OverwriteModelError
const BusLocation = mongoose.models.BusLocation || mongoose.model('BusLocation', busLocationSchema);
export default BusLocation;
