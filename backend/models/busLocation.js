import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    index: true // optional: improves query performance when filtering by busId
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

const BusLocation = mongoose.model('BusLocation', busLocationSchema);
export default BusLocation;
