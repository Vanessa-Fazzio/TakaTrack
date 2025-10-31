import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapsAndNotifications.css";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const yellowIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const initialMarkers = [
  { id: 1, name: "Point 1", lat: -1.286, lng: 36.817 },
  { id: 2, name: "Point 2", lat: -1.288, lng: 36.819 },
  { id: 3, name: "Point 3", lat: -1.289, lng: 36.820 },
  { id: 4, name: "Point 4", lat: -1.291, lng: 36.821 },
  { id: 5, name: "Point 5", lat: -1.293, lng: 36.822 },
  { id: 6, name: "Point 6", lat: -1.295, lng: 36.823 },
  { id: 7, name: "Point 7", lat: -1.297, lng: 36.824 },
  { id: 8, name: "Point 8", lat: -1.299, lng: 36.825 },
  { id: 9, name: "Point 9", lat: -1.301, lng: 36.826 },
  { id: 10, name: "Point 10", lat: -1.303, lng: 36.827 },
  { id: 11, name: "Point 11", lat: -1.305, lng: 36.828 },
  { id: 12, name: "Point 12", lat: -1.307, lng: 36.829 },
  { id: 13, name: "Point 13", lat: -1.309, lng: 36.830 },
  { id: 14, name: "Point 14", lat: -1.311, lng: 36.831 },
  { id: 15, name: "Point 15", lat: -1.313, lng: 36.832 },
];

export default function MapsAndNotifications() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const assignColors = () =>
      initialMarkers.map((m) => ({
        ...m,
        status: ["Full", "Half", "Empty"][Math.floor(Math.random() * 3)],
      }));

    setMarkers(assignColors());

    const interval = setInterval(() => {
      setMarkers(assignColors());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (status) => {
    if (status === "Full") return redIcon;
    if (status === "Half") return yellowIcon;
    return greenIcon;
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[-1.2921, 36.8219]} 
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={getIcon(m.status)}
          >
            <Popup>
              <b>{m.name}</b>
              <br />
              Status:{" "}
              <span
                style={{
                  color:
                    m.status === "Full"
                      ? "red"
                      : m.status === "Half"
                      ? "orange"
                      : "green",
                  fontWeight: "bold",
                }}
              >
                {m.status}
              </span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
