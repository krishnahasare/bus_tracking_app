import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

export default function SearchLocation() {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [googleInstance, setGoogleInstance] = useState(null);


  // Fetch latest location every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchLatestLocation, 1000);
    fetchLatestLocation(); // initial load

    return () => clearInterval(intervalId); // cleanup
  }, []);

  const fetchLatestLocation = async () => {
    try {
      const res = await axios.get('https://bus-tracking-app-wt0f.onrender.com/api/buslocation');
      const locations = res.data;

      if (locations.length > 0) {
        const latest = locations[locations.length - 1];
        setMarkerPosition({ lat: latest.latitude, lng: latest.longitude });
        setAllLocations(locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Live Bus Tracker</h2>

      <div className="mt-6 mb-6">
       <LoadScript
  googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"
  onLoad={() => setGoogleInstance(window.google)}
>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition || defaultCenter}
            zoom={15}
          >
      {markerPosition && googleInstance && (
  <Marker
    position={markerPosition}
    icon={{
      url: 'http://maps.google.com/mapfiles/kml/shapes/bus.png', // ✅ This works reliably
      scaledSize: new googleInstance.maps.Size(40, 40),
    }}
  />
)}

          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
