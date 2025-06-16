import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

// Define route colors for up to 5 buses
const routeColors = ['#FF0000', '#008000', '#0000FF', '#FFA500', '#800080'];

const SearchLocation = () => {
  const [buses, setBuses] = useState([]);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <h1 className="text-3xl font-bold text-center mb-6">Admin Bus Dashboard</h1>

      <LoadScript
        googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"
        onLoad={() => setGoogleInstance(window.google)}
      >
        {buses.map((bus, index) => (
          <div
            key={index}
            className="max-w-5xl mx-auto mb-8 rounded-xl shadow-xl overflow-hidden border"
          >
            <div className="p-4 flex justify-between items-center bg-gray-100 text-lg font-semibold">
              <span>Bus ID: {bus.busId}</span>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                onClick={() => navigate(`/singlebus?busId=${bus.busId}`)}
              >
                View Individually
              </button>
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
              {/* Marker */}
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

              {/* Polyline Path */}
              {bus.path.length > 1 && (
                <Polyline
                  path={bus.path.map((point) => ({
                    lat: point.latitude,
                    lng: point.longitude,
                  }))}
                  options={{
                    strokeColor: routeColors[index % routeColors.length],
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

      {/* Legend */}
      <div className="mt-6 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-2">Route Color Legend</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {buses.map((bus, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span
                className="inline-block w-6 h-3 rounded"
                style={{ backgroundColor: routeColors[index % routeColors.length] }}
              ></span>
              <span className="text-sm">Bus ID: {bus.busId}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchLocation;
