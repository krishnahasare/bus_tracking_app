import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 19.0760, // Mumbai
  lng: 72.8777,
};

const SearchLocation = () => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [error, setError] = useState(null);
  const [googleInstance, setGoogleInstance] = useState(null);

  const BUS_ID = 'bus_101'; // Change this as needed or make it dynamic

  useEffect(() => {
    const fetchLiveLocation = async () => {
      try {
        const response = await axios.get(
          `https://bus-tracking-app-wt0f.onrender.com/api/buslocation?busId=${BUS_ID}`
        );
        const locations = response.data;

        if (locations && locations.length > 0) {
          const latestLocation = locations[0]; // newest comes first from backend
          setMarkerPosition({
            lat: latestLocation.latitude,
            lng: latestLocation.longitude,
          });
          setError(null);
        } else {
          setError('No location data available for this bus.');
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
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Live Bus Tracker
      </h2>

      <div className="relative max-w-5xl mx-auto mt-6 mb-6 p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-[1.005] hover:shadow-3xl">
        <div className="relative rounded-[calc(1.5rem-4px)] overflow-hidden bg-white">
          <LoadScript
            googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI" // Replace with your own
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
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default SearchLocation;
