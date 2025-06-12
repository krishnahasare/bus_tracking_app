import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
<<<<<<< HEAD
  Polyline,
=======
  Polyline
>>>>>>> 28e29da943a76cbdc600e237de656b1ac8ee7aeb
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
<<<<<<< HEAD
  lat: 19.0760, // Mumbai
=======
  lat: 19.0760,
>>>>>>> 28e29da943a76cbdc600e237de656b1ac8ee7aeb
  lng: 72.8777,
};

const BUS_ID = 'bus_101';

const SearchLocation = () => {
  const [markerPosition, setMarkerPosition] = useState(null);
<<<<<<< HEAD
  const [routePath, setRoutePath] = useState([]);
=======
  const [routePath, setRoutePath] = useState([]); // ✅ Step 1: Store route path
>>>>>>> 28e29da943a76cbdc600e237de656b1ac8ee7aeb
  const [error, setError] = useState(null);
  const [googleInstance, setGoogleInstance] = useState(null);

  useEffect(() => {
    const fetchLiveLocation = async () => {
      try {
        const response = await axios.get(
          `https://bus-tracking-app-wt0f.onrender.com/api/buslocation?busId=${BUS_ID}`
        );
        const locations = response.data;

        if (locations && locations.length > 0) {
<<<<<<< HEAD
          // API returns newest first
          const latest = locations[0];
          setMarkerPosition({ lat: latest.latitude, lng: latest.longitude });

          const path = locations
            .map(loc => ({
              lat: loc.latitude,
              lng: loc.longitude,
            }))
            .reverse(); // Optional: draw from oldest to latest

          setRoutePath(path);
=======
          const latestLocation = locations[locations.length - 1];
          const newPosition = {
            lat: latestLocation.latitude,
            lng: latestLocation.longitude,
          };

          setMarkerPosition(newPosition);
          setRoutePath((prevPath) => [...prevPath, newPosition]); // ✅ Step 2: Append to route
>>>>>>> 28e29da943a76cbdc600e237de656b1ac8ee7aeb
          setError(null);
        } else {
          setError('No location data available for this bus.');
          setMarkerPosition(null);
          setRoutePath([]);
        }
      } catch (err) {
        setError('Failed to fetch location. Make sure your backend is running.');
        console.error('Error fetching location:', err);
        setMarkerPosition(null);
        setRoutePath([]);
      }
    };

    fetchLiveLocation();
    const intervalId = setInterval(fetchLiveLocation, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Live Bus Tracker with Route
      </h2>

<<<<<<< HEAD
      <div className="relative max-w-5xl mx-auto mt-6 mb-6 p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-[1.005] hover:shadow-3xl">
        <div className="relative rounded-[calc(1.5rem-4px)] overflow-hidden bg-white">
          <LoadScript
            googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI" // Replace with your key
=======
      <div className="relative max-w-5xl mx-auto mt-6 mb-6 p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
        <div className="relative rounded-[calc(1.5rem-4px)] overflow-hidden bg-white">
          <LoadScript
            googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"
>>>>>>> 28e29da943a76cbdc600e237de656b1ac8ee7aeb
            onLoad={() => setGoogleInstance(window.google)}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition || defaultCenter}
              zoom={15}
            >
              {/* Marker */}
              {markerPosition && googleInstance && (
                <Marker
                  position={markerPosition}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/bus.png',
                    scaledSize: new googleInstance.maps.Size(40, 40),
                  }}
                />
              )}

<<<<<<< HEAD
              {/* Route Polyline */}
=======
              {/* ✅ Step 3: Draw the route path */}
>>>>>>> 28e29da943a76cbdc600e237de656b1ac8ee7aeb
              {routePath.length > 1 && (
                <Polyline
                  path={routePath}
                  options={{
<<<<<<< HEAD
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
=======
                    strokeColor: 'red',
                    strokeOpacity: 0.9,
                    strokeWeight: 7,
                    clickable: false,
                    draggable: false,
                    editable: false,
>>>>>>> 28e29da943a76cbdc600e237de656b1ac8ee7aeb
                    geodesic: true,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default SearchLocation;
