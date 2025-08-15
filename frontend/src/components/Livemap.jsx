import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function AnalyticsMap() {
  const [busLocations, setBusLocations] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token"); // or however you store it

  fetch("http://localhost:5000/api/analytics/bus-locations", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch bus locations");
      return res.json();
    })
    .then(data => setBusLocations(data))
    .catch(err => console.error(err));
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
