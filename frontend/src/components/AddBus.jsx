import React, { useState } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: 16.7049873, lng: 74.2432527 }; // Kolhapur center

const AddBus = () => {
  const [formData, setFormData] = useState({
    busId: '',
    name: '',
    route: '',
    driverName: '',
    status: 'active',
    stops: [],
  });

  const [currentStopName, setCurrentStopName] = useState('');
  const [message, setMessage] = useState('');
  const [routePath, setRoutePath] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapClick = (e) => {
    if (!currentStopName.trim()) {
      alert('Enter stop name before adding it on map!');
      return;
    }

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const newStop = {
      name: currentStopName,
      latitude: lat,
      longitude: lng,
    };

    setFormData({
      ...formData,
      stops: [...formData.stops, newStop],
    });

    setRoutePath([...routePath, { lat, lng }]);
    setCurrentStopName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.stops.length === 0) {
      alert('Please add at least one stop');
      return;
    }

    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/addbus', formData);
      setMessage('✅ Bus added successfully!');
      setFormData({ busId: '', name: '', route: '', driverName: '', status: 'active', stops: [] });
      setRoutePath([]);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to add bus. Make sure Bus ID is unique.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Add New Bus with Map</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="busId" placeholder="Bus ID" value={formData.busId} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <input name="name" placeholder="Bus Name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <input name="route" placeholder="Route" value={formData.route} onChange={handleInputChange} className="w-full border p-2 rounded" />
        <input name="driverName" placeholder="Driver Name" value={formData.driverName} onChange={handleInputChange} className="w-full border p-2 rounded" />
        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border p-2 rounded">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Stop Input with Map */}
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold mb-2">Add Stops on Map</h3>
          <input
            placeholder="Enter Stop Name then click on map"
            value={currentStopName}
            onChange={(e) => setCurrentStopName(e.target.value)}
            className="w-full mb-2 border p-2 rounded"
          />

          <LoadScript googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onClick={handleMapClick}
            >
              {formData.stops.map((stop, idx) => (
                <Marker
                  key={idx}
                  position={{ lat: stop.latitude, lng: stop.longitude }}
                  label={{ text: stop.name, color: 'black', fontWeight: 'bold' }}
                />
              ))}

              {routePath.length > 1 && (
                <Polyline
                  path={routePath}
                  options={{
                    strokeColor: '#4285F4',
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    geodesic: true,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Show added stops */}
        {formData.stops.length > 0 && (
          <ul className="mt-4 list-disc pl-6 text-sm text-gray-700">
            {formData.stops.map((s, i) => (
              <li key={i}>{s.name} ({s.latitude.toFixed(4)}, {s.longitude.toFixed(4)})</li>
            ))}
          </ul>
        )}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Submit Bus</button>
        {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
      </form>
    </div>
  );
};

export default AddBus;
