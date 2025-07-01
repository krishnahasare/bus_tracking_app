import axios from 'axios';
import polyline from '@mapbox/polyline'; // You need to install this: `npm i @mapbox/polyline`

const BUS_ID = 'bus_203';
const API_KEY = 'AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI'; // 🔐 Replace with your real key

const start = 'rankala  , Kolhapur'; // Starting point
const end = 'D Y Patil College, Kasaba Bawada, Kolhapur';

async function getRoute() {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}&key=${API_KEY}`;

  try {
    const res = await axios.get(url);
    const encodedPoints = res.data.routes[0].overview_polyline.points;
    return polyline.decode(encodedPoints); // Array of [lat, lng]
  } catch (err) {
    console.error('❌ Failed to fetch route:', err.message);
    return [];
  }
}

async function simulateBus(route) {
  let index = 0;
  const interval = setInterval(async () => {
    if (index >= route.length) {
      console.log('🏁 Bus reached destination.');
      clearInterval(interval);
      return;
    }

    const [lat, lng] = route[index];
    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/buslocation', {
        latitude: lat,
        longitude: lng,
        busId: BUS_ID,
      });
      console.log(`📍 Sent location: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (err) {
      console.error('❌ Send error:', err.message);
    }

    index++;
  }, 2000); // Sends every 2 seconds
}

(async () => {
  const route = await getRoute();
  if (route.length > 0) {
    simulateBus(route);
  } else {
    console.error('❌ No route found to simulate.');
  }
})();
