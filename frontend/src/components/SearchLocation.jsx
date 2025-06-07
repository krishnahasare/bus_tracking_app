import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 19.0760, // Mumbai default
  lng: 72.8777,
};

export default function SearchLocation() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const [allLocations, setAllLocations] = useState([]);

  // Fetch all locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('https://bus-tracking-app-wt0f.onrender.com/api/buslocation'); // corrected URL with /api prefix
      setAllLocations(res.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid numbers for latitude and longitude.');
      return;
    }

    setMarkerPosition({ lat, lng });

    // Save new location to backend
    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/searchlocation', { latitude: lat, longitude: lng }); // corrected URL with /api prefix
      fetchLocations(); // Refresh list after adding
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to save location. Check console.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Bus Location by Coordinates</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Show on Map & Save
        </button>
      </form>

      <div className="mt-6">
        <LoadScript googleMapsApiKey={"AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition || defaultCenter}
            zoom={12}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Show all locations below the map */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">All Saved Bus Locations:</h3>
        {allLocations.length === 0 ? (
          <p>No locations saved yet.</p>
        ) : (
          <ul className="list-disc list-inside max-h-64 overflow-auto border p-4 rounded bg-gray-50">
            {allLocations.map((loc) => (
              <li key={loc._id}>
                Latitude: {loc.latitude}, Longitude: {loc.longitude}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
