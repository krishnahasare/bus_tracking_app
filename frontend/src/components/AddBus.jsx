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
    cameraUrl: '', // 📸 NEW FIELD
    stops: [],
  });

  const [routePath, setRoutePath] = useState([]);
  const [stopName, setStopName] = useState('');
  const [selectedStopIndex, setSelectedStopIndex] = useState(null);
  const [message, setMessage] = useState('');

  const handleMapClick = (e) => {
    if (!stopName.trim()) {
      alert('Enter stop name first!');
      return;
    }

    const newStop = {
      name: stopName,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    };

    const updatedStops = [...formData.stops, newStop];
    setFormData({ ...formData, stops: updatedStops });
    setRoutePath([...routePath, { lat: newStop.latitude, lng: newStop.longitude }]);
    setStopName('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const deleteStop = (index) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    const updatedPath = routePath.filter((_, i) => i !== index);
    setFormData({ ...formData, stops: updatedStops });
    setRoutePath(updatedPath);
    setSelectedStopIndex(null);
  };

  const editStopName = (index, newName) => {
    const updatedStops = [...formData.stops];
    updatedStops[index].name = newName;
    setFormData({ ...formData, stops: updatedStops });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.stops.length) return alert('Add at least one stop.');
    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/addbus', formData);
      setMessage('✅ Bus and route saved!');
      setFormData({
        busId: '',
        name: '',
        route: '',
        driverName: '',
        status: 'active',
        cameraUrl: '',
        stops: [],
      });
      setRoutePath([]);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to save bus. Try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Add New Bus with Interactive Map</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="busId" placeholder="Bus ID" value={formData.busId} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <input name="name" placeholder="Bus Name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <input name="route" placeholder="Route Description" value={formData.route} onChange={handleInputChange} className="w-full border p-2 rounded" />
        <input name="driverName" placeholder="Driver Name" value={formData.driverName} onChange={handleInputChange} className="w-full border p-2 rounded" />
        
        {/* 📸 New Camera URL Field */}
        <input name="cameraUrl" placeholder="Camera Stream URL (optional)" value={formData.cameraUrl} onChange={handleInputChange} className="w-full border p-2 rounded" />
        
        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border p-2 rounded">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Stop name input */}
        <div className="bg-gray-100 p-4 rounded border">
          <input
            placeholder="Enter stop name, then click on map"
            value={stopName}
            onChange={(e) => setStopName(e.target.value)}
            className="w-full mb-3 border p-2 rounded"
          />
          <LoadScript googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onClick={handleMapClick}
            >
              {/* Route line */}
              {routePath.length > 1 && (
                <Polyline
                  path={routePath}
                  options={{
                    strokeColor: '#00B0FF',
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                    geodesic: true,
                  }}
                />
              )}
              {/* Markers */}
              {formData.stops.map((stop, index) => (
                <Marker
                  key={index}
                  position={{ lat: stop.latitude, lng: stop.longitude }}
                  label={{ text: stop.name, color: 'black' }}
                  onClick={() => setSelectedStopIndex(index)}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Stops list */}
        {formData.stops.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm">
            {formData.stops.map((stop, i) => (
              <li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                <div className="flex-1">
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={stop.name}
                    onChange={(e) => editStopName(i, e.target.value)}
                  />
                  <p className="text-gray-600 text-xs mt-1">
                    ({stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteStop(i)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Save Bus & Route</button>
        {message && <p className="mt-2 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default AddBus;
