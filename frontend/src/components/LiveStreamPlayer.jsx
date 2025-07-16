// File: frontend/src/components/LiveStreamPlayer.jsx
import React from 'react';

const LiveStreamPlayer = ({ busId, streamUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-bold mb-2">{busId}</h2>
      {streamUrl ? (
        <video
          src={streamUrl}
          controls
          autoPlay
          muted
          className="w-full rounded"
        />
      ) : (
        <p className="text-gray-500">No stream available.</p>
      )}
    </div>
  );
};

export default LiveStreamPlayer;
