import React, { useState, useEffect, useRef } from 'react';
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
  lat: 19.0760,
  lng: 72.8777,
};

const BUS_ID = 'bus_101';

const SearchLocation = () => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [error, setError] = useState(null);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const intervalRef = useRef(null);

  // Live Tracking
  useEffect(() => {
    if (isSearchMode) return;

    const fetchLiveLocation = async () => {
      try {
        const response = await axios.get(
          `https://bus-tracking-app-wt0f.onrender.com/api/buslocation?busId=${BUS_ID}`
        );
        const locations = response.data;

        if (locations && locations.length > 0) {
          const latest = locations[0];

          const newPos = {
            lat: latest.latitude,
            lng: latest.longitude,
          };

          setMarkerPosition(newPos);
          setRoutePath((prev) => [...prev, newPos]);
          setError(null);
        } else {
          setError('No live data available.');
        }
      } catch (err) {
        console.error('Live fetch error:', err);
        setError('Failed to fetch live location.');
      }
    };

    fetchLiveLocation();
    intervalRef.current = setInterval(fetchLiveLocation, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isSearchMode]);

  const handleDateSearch = async () => {
    if (!selectedDate) {
      setError('Please select a date.');
      return;
    }

    setIsSearchMode(true);
    clearInterval(intervalRef.current);

    try {
      const response = await axios.get(
        `https://bus-tracking-app-wt0f.onrender.com/api/buslocation?busId=${BUS_ID}&date=${selectedDate}`
      );

      const locations = response.data;

      if (locations && locations.length > 0) {
        const path = locations.map((loc) => ({
          lat: loc.latitude,
          lng: loc.longitude,
        }));

        setRoutePath(path);
        setMarkerPosition(path[path.length - 1]);
        setError(null);
      } else {
        setRoutePath([]);
        setMarkerPosition(null);
        setError('No location data found for this date.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch route for this date.');
    }
  };

  const handleResetLive = () => {
    setRoutePath([]);
    setSelectedDate('');
    setIsSearchMode(false);
    setError(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Smart Bus Tracker
      </h2>

      {/* Date Picker UI */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <input
          type="date"
          className="border px-3 py-2 rounded shadow"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleDateSearch}
        >
          Search by Date
        </button>
        {isSearchMode && (
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={handleResetLive}
          >
            Back to Live
          </button>
        )}
      </div>

      {/* Map Container */}
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
              {/* Route Polyline */}
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
