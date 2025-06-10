import axios from 'axios';

// Base location – (e.g., near Mumbai)
let currentLat = 19.0760;
let currentLng = 72.8777;

function getRandomDelta() {
  return (Math.random() - 0.5) * 0.002; // small variation
}

async function simulateMovement() {
  // Move slightly
  currentLat += getRandomDelta();
  currentLng += getRandomDelta();

  try {
    const response = await axios.post('https://bus-tracking-app-wt0f.onrender.com/searchlocation', {
      latitude: currentLat,
      longitude: currentLng,
    });

    console.log(`[✔] Location sent: ${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`);
  } catch (error) {
    console.error('[✘] Failed to send location:', error.message);
  }
}

// Send new location every 5 seconds
setInterval(simulateMovement, 1000);
