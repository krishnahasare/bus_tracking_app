import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

const SearchLocation = () => {
  const [buses, setBuses] = useState([]);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://bus-tracking-app-wt0f.onrender.com/buslocation');
      setBuses(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load bus data.');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Live Bus Tracker</h1>

      <LoadScript
        googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"
        onLoad={() => setGoogleInstance(window.google)}
      >
        {buses.map((bus, index) => (
          <div
            key={index}
            className="max-w-5xl mx-auto mb-8 rounded-xl shadow-xl overflow-hidden border"
          >
            <div className="p-4 bg-gray-100 text-lg font-semibold">
              Bus ID: {bus.busId}
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={
                bus.latest
                  ? { lat: bus.latest.latitude, lng: bus.latest.longitude }
                  : defaultCenter
              }
              zoom={15}
            >
              {/* Live Marker */}
              {bus.latest && googleInstance && (
                <Marker
                  position={{
                    lat: bus.latest.latitude,
                    lng: bus.latest.longitude,
                  }}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/bus.png',
                    scaledSize: new googleInstance.maps.Size(40, 40),
                  }}
                />
              )}

              {/* Route Polyline */}
              {bus.path.length > 1 && (
                <Polyline
                  path={bus.path.map((point) => ({
                    lat: point.latitude,
                    lng: point.longitude,
                  }))}
                  options={{
                    strokeColor: '#1E90FF',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                  }}
                />
              )}
            </GoogleMap>
          </div>
        ))}
      </LoadScript>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default SearchLocation;
