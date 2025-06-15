import axios from 'axios';

// Starting and ending coordinates
const startPoint = { lat: 19.0760, lng: 72.8777 }; // Example: Mumbai
const endPoint = { lat: 19.0860, lng: 72.8877 };   // Slightly away

let currentLat = startPoint.lat;
let currentLng = startPoint.lng;

const stepSize = 0.0002; // Smaller = slower movement
const BUS_ID = 'bus_101';

function moveTowardsTarget(current, target, step) {
  const delta = target - current;
  if (Math.abs(delta) < step) return target;
  return current + (delta > 0 ? step : -step);
}

async function sendLocation() {
  currentLat = moveTowardsTarget(currentLat, endPoint.lat, stepSize);
  currentLng = moveTowardsTarget(currentLng, endPoint.lng, stepSize);

  try {
    const response = await axios.post('http://localhost:5000/buslocation', {
      latitude: currentLat,
      longitude: currentLng,
      busId: BUS_ID
    });

    console.log(`✅ Location sent: ${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`);
  } catch (error) {
    if (error.response) {
      console.error('❌ Server responded with:', error.response.status, error.response.data);
    } else {
      console.error('❌ Failed to send location:', error.message);
    }
  }

  // Stop simulation when destination is reached
  if (
    Math.abs(currentLat - endPoint.lat) < 0.0001 &&
    Math.abs(currentLng - endPoint.lng) < 0.0001
  ) {
    console.log('🏁 Destination reached.');
    clearInterval(intervalId);
  }
}

// Run sendLocation every second
const intervalId = setInterval(sendLocation, 1000);
