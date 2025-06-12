import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

const SearchLocation = () => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [routePath, setRoutePath] = useState([]); // ✅ Step 1: Store route path
  const [error, setError] = useState(null);
  const [googleInstance, setGoogleInstance] = useState(null);

  useEffect(() => {
    const fetchLiveLocation = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/buslocation');
        const locations = response.data;

        if (locations && locations.length > 0) {
          const latestLocation = locations[locations.length - 1];
          const newPosition = {
            lat: latestLocation.latitude,
            lng: latestLocation.longitude,
          };

          setMarkerPosition(newPosition);
          setRoutePath((prevPath) => [...prevPath, newPosition]); // ✅ Step 2: Append to route
          setError(null);
        } else {
          setError('No location data available.');
          setMarkerPosition(null);
        }
      } catch (err) {
        setError('Failed to fetch location. Make sure your backend is running.');
        console.error('Error fetching location:', err);
        setMarkerPosition(null);
      }
    };

    fetchLiveLocation();
    const intervalId = setInterval(fetchLiveLocation, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Live Bus Tracker</h2>

      <div className="relative max-w-5xl mx-auto mt-6 mb-6 p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
        <div className="relative rounded-[calc(1.5rem-4px)] overflow-hidden bg-white">
          <LoadScript
            googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"
            onLoad={() => setGoogleInstance(window.google)}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition || defaultCenter}
              zoom={15}
            >
              {markerPosition && googleInstance && (
                <Marker
                  position={markerPosition}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/bus.png',
                    scaledSize: new googleInstance.maps.Size(40, 40),
                  }}
                />
              )}

              {/* ✅ Step 3: Draw the route path */}
              {routePath.length > 1 && (
                <Polyline
                  path={routePath}
                  options={{
                    strokeColor: 'red',
                    strokeOpacity: 0.9,
                    strokeWeight: 7,
                    clickable: false,
                    draggable: false,
                    editable: false,
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
