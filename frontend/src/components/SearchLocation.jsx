import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const fullScreenStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

// 🔵 Predefined color list
const colors = ['#FF5733', '#1E90FF', '#28A745', '#FFC300', '#8E44AD'];

const SearchLocation = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
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

  const selectedBus = buses.find((bus) => bus.busId === selectedBusId);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Live Bus Tracker</h1>

      <LoadScript
        googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"
        onLoad={() => setGoogleInstance(window.google)}
      >
        {selectedBusId ? (
          // ✅ View Live (Don't change)
          <div className="max-w-7xl mx-auto mb-8 rounded-xl shadow-xl overflow-hidden border">
            <div className="p-4 bg-gray-100 text-lg font-semibold flex justify-between items-center">
              Bus ID: {selectedBus.busId}
              <button
                onClick={() => setSelectedBusId(null)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Back
              </button>
            </div>
            <GoogleMap
              mapContainerStyle={fullScreenStyle}
              center={
                selectedBus.latest
                  ? { lat: selectedBus.latest.latitude, lng: selectedBus.latest.longitude }
                  : defaultCenter
              }
              zoom={15}
            >
              {selectedBus.latest && googleInstance && (
                <Marker
                  position={{
                    lat: selectedBus.latest.latitude,
                    lng: selectedBus.latest.longitude,
                  }}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/bus.png',
                    scaledSize: new googleInstance.maps.Size(40, 40),
                  }}
                />
              )}
              {selectedBus.path.length > 1 && (
                <Polyline
                  path={selectedBus.path.map((point) => ({
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
        ) : (
          <>
            {/* 🔵 MULTI-BUS MAP VIEW */}
            {buses.map((bus, index) => {
              const color = colors[index % colors.length]; // Assign unique color
              return (
                <div
                  key={index}
                  className="max-w-5xl mx-auto mb-8 rounded-xl shadow-xl overflow-hidden border"
                >
                  <div className="p-4 bg-gray-100 text-lg font-semibold flex justify-between items-center">
                    Bus ID: {bus.busId}
                    <button
                      onClick={() => setSelectedBusId(bus.busId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Live
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
                    {bus.path.length > 1 && (
                      <Polyline
                        path={bus.path.map((point) => ({
                          lat: point.latitude,
                          lng: point.longitude,
                        }))}
                        options={{
                          strokeColor: color,
                          strokeOpacity: 0.8,
                          strokeWeight: 4,
                        }}
                      />
                    )}
                  </GoogleMap>
                </div>
              );
            })}

            {/* 🔵 LEGEND SECTION */}
            <div className="max-w-4xl mx-auto mt-6 p-4 bg-gray-100 rounded shadow-md">
              <h3 className="text-xl font-semibold mb-2">Color Legend</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {buses.map((bus, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div
                      className="w-6 h-3 rounded"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span>{bus.busId}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </LoadScript>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default SearchLocation;
