// File: frontend/src/pages/LiveStreams.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LiveStreamPlayer from '../components/LiveStreamPlayer';
import { VideoLibrary } from '@mui/icons-material'; // Professional icon

const LiveStreams = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await axios.get('https://bus-tracking-app-wt0f.onrender.com/allbusstreams');
        setBuses(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch bus streams', err);
      }
    };

    fetchStreams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 font-sans">
      <div className="flex items-center gap-2 mb-6">
        <VideoLibrary fontSize="large" className="text-blue-600" />
        <h1 className="text-3xl font-semibold text-gray-800">Live Bus Video Streams</h1>
      </div>

      {buses.length === 0 ? (
        <div className="text-center text-gray-500">Loading live streams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div
              key={bus.busId}
              className="rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <LiveStreamPlayer
                busId={bus.busId}
                streamUrl={bus.streamUrl}
              />
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-700">Bus ID: {bus.busId}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveStreams;
