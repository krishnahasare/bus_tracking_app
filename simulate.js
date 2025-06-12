import axios from 'axios';

// Start and End points (You can set these to anything you want)
const startPoint = { lat: 19.0760, lng: 72.8777 }; // Mumbai
const endPoint = { lat: 19.0860, lng: 72.8877 };   // Few km away

let currentLat = startPoint.lat;
let currentLng = startPoint.lng;

const stepSize = 0.0002; // Smaller = slower movement

function moveTowardsTarget(current, target, step) {
  const delta = target - current;
  if (Math.abs(delta) < step) return target;
  return current + (delta > 0 ? step : -step);
}

async function simulateMovement() {
  // Move toward endPoint step-by-step
  currentLat = moveTowardsTarget(currentLat, endPoint.lat, stepSize);
  currentLng = moveTowardsTarget(currentLng, endPoint.lng, stepSize);

  try {
    const response = await axios.post('http://localhost:5000/searchlocation', {
      latitude: currentLat,
      longitude: currentLng,
    });

    console.log(`[✔] Location sent: ${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`);
  } catch (error) {
    console.error('[✘] Failed to send location:', error.message);
  }

  // Optional: stop simulation if destination reached
  if (
    Math.abs(currentLat - endPoint.lat) < 0.0001 &&
    Math.abs(currentLng - endPoint.lng) < 0.0001
  ) {
    console.log('✅ Destination reached.');
    process.exit(0); // Stop script
  }
}

setInterval(simulateMovement, 1000); // Move every second
