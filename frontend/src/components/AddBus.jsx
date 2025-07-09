import React, { useState } from 'react';
import axios from 'axios';

const AddBus = () => {
  const [formData, setFormData] = useState({
    busId: '',
    name: '',
    route: '',
    driverName: '',
    status: 'active',
    stops: [],
  });

  const [newStop, setNewStop] = useState({ name: '', latitude: '', longitude: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStopChange = (e) => {
    setNewStop({ ...newStop, [e.target.name]: e.target.value });
  };

  const addStop = () => {
    if (!newStop.name || !newStop.latitude || !newStop.longitude) return alert("Fill all stop fields");
    setFormData({
      ...formData,
      stops: [...formData.stops, {
        name: newStop.name,
        latitude: parseFloat(newStop.latitude),
        longitude: parseFloat(newStop.longitude),
      }],
    });
    setNewStop({ name: '', latitude: '', longitude: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/addbus', formData);
      setMessage('✅ Bus added successfully!');
      setFormData({ busId: '', name: '', route: '', driverName: '', status: 'active', stops: [] });
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to add bus. Make sure Bus ID is unique.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="busId" placeholder="Bus ID" value={formData.busId} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <input name="name" placeholder="Bus Name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <input name="route" placeholder="Route" value={formData.route} onChange={handleInputChange} className="w-full border p-2 rounded" />
        <input name="driverName" placeholder="Driver Name" value={formData.driverName} onChange={handleInputChange} className="w-full border p-2 rounded" />
        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border p-2 rounded">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Stop Inputs */}
        <div className="bg-gray-50 p-4 rounded border mt-4">
          <h3 className="font-semibold mb-2">Add Stop</h3>
          <input name="name" placeholder="Stop Name" value={newStop.name} onChange={handleStopChange} className="w-full mb-2 border p-2 rounded" />
          <input name="latitude" placeholder="Latitude" type="number" value={newStop.latitude} onChange={handleStopChange} className="w-full mb-2 border p-2 rounded" />
          <input name="longitude" placeholder="Longitude" type="number" value={newStop.longitude} onChange={handleStopChange} className="w-full mb-2 border p-2 rounded" />
          <button type="button" onClick={addStop} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Stop
          </button>
        </div>

        {/* Show added stops */}
        {formData.stops.length > 0 && (
          <ul className="mt-4 list-disc pl-6 text-sm text-gray-700">
            {formData.stops.map((s, i) => (
              <li key={i}>{s.name} ({s.latitude}, {s.longitude})</li>
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
