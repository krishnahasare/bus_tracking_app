import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  Circle,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

const colors = ['#FF0000', '#0000FF', '#008000', '#FFA500', '#800080'];

const mapOptions = {
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'on' }] },
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

const SearchLocation = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [error, setError] = useState(null);

  const routeCache = useRef({});

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

  const renderMap = (bus, index, fullScreen = false) => {
    const path =
      routeCache.current[bus.busId] ||
      (bus.path.length > 1 ? bus.path.map(p => ({ lat: p.latitude, lng: p.longitude })) : []);

    if (!routeCache.current[bus.busId] && path.length > 1) {
      routeCache.current[bus.busId] = path;
    }

    return (
      <GoogleMap
        mapContainerStyle={fullScreen ? containerStyle : { width: '100%', height: '400px' }}
        center={bus.latest ? { lat: bus.latest.latitude, lng: bus.latest.longitude } : defaultCenter}
        zoom={15}
        options={mapOptions}
      >
        {path.length > 1 && googleInstance && (
          <Polyline
            path={path}
            options={{
              strokeColor: '#4285F4',
              strokeOpacity: 1,
              strokeWeight: 5,
              geodesic: true,
              icons: [
                {
                  icon: {
                    path: googleInstance.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2,
                    strokeColor: '#4285F4',
                  },
                  offset: '100%',
                },
              ],
            }}
          />
        )}

        {bus.stops?.map((stop, i) => (
          <React.Fragment key={`stop-${bus.busId}-${i}`}>
            <Marker
              position={{ lat: stop.latitude, lng: stop.longitude }}
              label={{
                text: `${i + 1}`,
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
              icon={{
                url: 'https://img.icons8.com/color/48/bus-stop.png',
                scaledSize: new googleInstance.maps.Size(32, 32),
              }}
              title={stop.name}
              animation={googleInstance.maps.Animation.DROP}
            />
            <Circle
              center={{ lat: stop.latitude, lng: stop.longitude }}
              radius={50}
              options={{
                strokeColor: '#34a853',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#34a853',
                fillOpacity: 0.35,
              }}
            />
          </React.Fragment>
        ))}

        {bus.latest && googleInstance && (
          <Marker
            position={{ lat: bus.latest.latitude, lng: bus.latest.longitude }}
            icon={{
              url: 'https://maps.gstatic.com/mapfiles/ms2/micons/bus.png',
              scaledSize: new googleInstance.maps.Size(40, 40),
              anchor: new googleInstance.maps.Point(20, 40),
              labelOrigin: new googleInstance.maps.Point(20, 15),
            }}
            animation={googleInstance.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Live Bus Tracker</h1>
      <LoadScript
        googleMapsApiKey="AIzaSyDjWXHa4cpYsQk01UBQUi6WtLtaZRRm1RI"
        onLoad={() => setGoogleInstance(window.google)}
      >
        {selectedBusId && selectedBus ? (
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
            {renderMap(selectedBus, 0, true)}
            <div className="bg-white p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">Bus Details</h2>
              <ul className="space-y-2 text-gray-800">
                <li><strong>Bus ID:</strong> {selectedBus.busId}</li>
                <li><strong>Current Location:</strong> {selectedBus.latest ? `${selectedBus.latest.latitude.toFixed(4)}, ${selectedBus.latest.longitude.toFixed(4)}` : 'Not available'}</li>
                <li><strong>Total Stops:</strong> {selectedBus.stops?.length || 0}</li>
                <li><strong>Last Updated:</strong> {selectedBus.latest?.timestamp ? new Date(selectedBus.latest.timestamp).toLocaleString() : 'Not available'}</li>
              </ul>
            </div>
          </div>
        ) : (
          [...buses].sort((a, b) => a.busId.localeCompare(b.busId)).map((bus, index) => (
            <div key={bus.busId} className="max-w-5xl mx-auto mb-8 rounded-xl shadow-xl overflow-hidden border">
              <div className="p-4 bg-gray-100 text-lg font-semibold flex justify-between items-center" style={{ borderLeft: `8px solid ${colors[index % colors.length]}` }}>
                Bus ID: {bus.busId}
                <button
                  onClick={() => setSelectedBusId(bus.busId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Live
                </button>
              </div>
              {renderMap(bus, index)}
              <div className="bg-white p-4 border-t">
                <h2 className="text-lg font-semibold mb-2">Bus Details</h2>
                <ul className="space-y-1 text-gray-800 text-sm">
                  <li><strong>Bus ID:</strong> {bus.busId}</li>
                  <li><strong>Current Location:</strong> {bus.latest ? `${bus.latest.latitude.toFixed(4)}, ${bus.latest.longitude.toFixed(4)}` : 'Not available'}</li>
                  <li><strong>Total Stops:</strong> {bus.stops?.length || 0}</li>
                  <li><strong>Last Updated:</strong> {bus.latest?.timestamp ? new Date(bus.latest.timestamp).toLocaleString() : 'Not available'}</li>
                </ul>
              </div>
            </div>
          ))
        )}
      </LoadScript>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default SearchLocation;
