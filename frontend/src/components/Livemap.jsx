import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function AnalyticsMap() {
  const [busLocations, setBusLocations] = useState([]);

  useEffect(() => {
    fetch("/api/analytics/bus-locations")
      .then(res => res.json())
      .then(data => setBusLocations(data));
  }, []);

  const mapContainerStyle = { width: "100%", height: "500px" };
  const center = { lat: 16.854, lng: 74.564 };

  return (
    <LoadScript googleMapsApiKey={"AIzaSyDfgM0PCpUAXFIGkOt4CmlcizPpyCcdoZA"}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
        {busLocations.map(bus => (
          <Marker
            key={bus._id}
            position={{
              lat: bus.lastLocation.lat,
              lng: bus.lastLocation.lng
            }}
            label={bus._id}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
