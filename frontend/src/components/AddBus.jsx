import React, { useState } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: 16.7049873, lng: 74.2432527 };

const AddBus = () => {
  const [formData, setFormData] = useState({
    busId: '',
    name: '',
    route: '',
    driverName: '',
    status: 'active',
    cameraUrl: '',
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
      console.log('Error saving bus:', err);
      setMessage('❌ Failed to save bus. Try again.');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white border shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600">Add New Bus</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="busId" placeholder="Bus ID" value={formData.busId} onChange={handleInputChange} className="border p-2 rounded w-full" required />
            <input name="name" placeholder="Bus Name" value={formData.name} onChange={handleInputChange} className="border p-2 rounded w-full" required />
            <input name="route" placeholder="Route Description" value={formData.route} onChange={handleInputChange} className="border p-2 rounded w-full" />
            <input name="driverName" placeholder="Driver Name" value={formData.driverName} onChange={handleInputChange} className="border p-2 rounded w-full" />
            <input name="cameraUrl" placeholder="Camera Stream URL" value={formData.cameraUrl} onChange={handleInputChange} className="border p-2 rounded w-full col-span-2" />
            <select name="status" value={formData.status} onChange={handleInputChange} className="border p-2 rounded w-full col-span-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Stop Input & Map */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Add Stops via Map</h3>
            <input
              placeholder="Enter stop name, then click on map"
              value={stopName}
              onChange={(e) => setStopName(e.target.value)}
              className="w-full mb-3 border p-2 rounded"
            />
            <LoadScript googleMapsApiKey="AIzaSyDfgM0PCpUAXFIGkOt4CmlcizPpyCcdoZA">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onClick={handleMapClick}
              >
                {routePath.length > 1 && (
                  <Polyline
                    path={routePath}
                    options={{
                      strokeColor: '#4F46E5',
                      strokeOpacity: 1.0,
                      strokeWeight: 4,
                      geodesic: true,
                    }}
                  />
                )}
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

          {/* Stops List */}
          {formData.stops.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-md font-medium">Stop List</h4>
              {formData.stops.map((stop, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border">
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
                    className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-lg font-semibold">
            Save Bus & Route
          </button>

          {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddBus;
