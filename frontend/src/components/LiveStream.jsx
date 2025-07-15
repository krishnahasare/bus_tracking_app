// File: frontend/src/pages/LiveStreams.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LiveStreamPlayer from '../components/LiveStreamPlayer';

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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Live Bus Video Streams</h1>
      {buses.length === 0 ? (
        <p className="text-center text-gray-500">Loading streams...</p>
      ) : (
        buses.map((bus) => (
          <LiveStreamPlayer
            key={bus.busId}
            name={bus.name}
            streamUrl={bus.streamUrl}
          />
        ))
      )}
    </div>
  );
};

export default LiveStreams;
