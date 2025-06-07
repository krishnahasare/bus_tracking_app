import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
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
