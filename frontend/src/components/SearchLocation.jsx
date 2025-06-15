import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 19.0760, // Mumbai
  lng: 72.8777,
};

const BUS_ID = 'bus_101'; // Can be dynamic

const SearchLocation = () => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [error, setError] = useState(null);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchLocationByDate = async () => {
    if (!selectedDate) {
      setError('Please select a date.');
      return;
    }

    try {
      const response = await axios.get(
        `https://bus-tracking-app-wt0f.onrender.com/api/buslocation?busId=${BUS_ID}&date=${selectedDate}`
      );

      const locations = response.data;

      if (locations && locations.length > 0) {
        const latest = locations[locations.length - 1];

        const path = locations.map(loc => ({
          lat: loc.latitude,
          lng: loc.longitude,
        }));

        setMarkerPosition({
          lat: latest.latitude,
          lng: latest.longitude,
        });
        setRoutePath(path);
        setError(null);
      } else {
        setMarkerPosition(null);
        setRoutePath([]);
        setError('No location data found for selected date.');
      }
    } catch (err) {
      setError('Error fetching route for selected date.');
      setRoutePath([]);
      setMarkerPosition(null);
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Live Bus Tracker (Search by Date)
      </h2>

      <div className="max-w-3xl mx-auto mb-6 flex justify-center gap-4 items-center">
        <input
          type="date"
          className="border p-2 rounded shadow"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={fetchLocationByDate}
        >
          Search
        </button>
      </div>

      <div className="relative max-w-5xl mx-auto p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
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
              {/* Route Line */}
              {routePath.length > 1 && (
                <Polyline
                  path={routePath}
                  options={{
                    strokeColor: '#FF5733',
                    strokeOpacity: 1,
                    strokeWeight: 4,
                  }}
                />
              )}

              {/* Bus Marker */}
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

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default SearchLocation;
