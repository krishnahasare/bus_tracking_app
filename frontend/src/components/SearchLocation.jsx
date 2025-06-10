import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 19.0760,
  lng: 72.8777,
};

const SearchLocation = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/buslocation');
        setSavedLocations(response.data);
      } catch (err) {
        setError('Failed to fetch saved locations.');
      }
    };
    fetchSavedLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid latitude and longitude values.');
      return;
    }

    setMarkerPosition({ lat, lng });
    setError(null);

    try {
      await axios.post('http://localhost:5000/searchlocation', { latitude: lat, longitude: lng });
      const response = await axios.get('http://localhost:5000/api/buslocation');
      setSavedLocations(response.data);
    } catch (err) {
      setError('Failed to save location.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

      {/* Display location logs */}
      <div>
        <h3 className="text-xl font-semibold mb-2">All Bus Locations:</h3>
        {allLocations.length === 0 ? (
          <p>No data yet.</p>
        ) : (
          <ul className="list-disc list-inside max-h-64 overflow-auto border p-4 rounded bg-gray-50">
            {allLocations.map((loc) => (
              <li key={loc._id}>
                Lat: {loc.latitude}, Lng: {loc.longitude}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchLocation;