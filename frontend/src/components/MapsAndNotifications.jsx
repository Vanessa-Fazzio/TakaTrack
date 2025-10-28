import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapsAndNotifications.css';

// --- Custom icons ---
const redIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const greenIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const yellowIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const userIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Choose icon by status ---
const getIconByStatus = (status) => {
  const s = status?.toLowerCase().trim();
  switch (s) {
    case 'full':
      return redIcon;
    case 'pending':
      return yellowIcon;
    case 'empty':
      return greenIcon;
    default:
      return greenIcon;
  }
};

// --- Auto fit map to markers ---
function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = markers.map((m) => [Number(m.lat), Number(m.lng)]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

// --- Generate random bins around Nairobi ---
const generateRandomBins = (count = 20) =>
  Array.from({ length: count }, (_, i) => {
    const baseLat = -1.286389; // Nairobi center
    const baseLng = 36.817223;
    const randomOffset = () => (Math.random() - 0.5) * 0.05; // ~5km spread
    const lat = baseLat + randomOffset();
    const lng = baseLng + randomOffset();

    return {
      id: `B${i + 1}`,
      name: `Bin ${i + 1}`,
      lat,
      lng,
      status: ['empty', 'pending', 'full'][Math.floor(Math.random() * 3)],
    };
  });
    //Bins are generated randomly....
export default function MapsAndNotifications() {
  const [bins, setBins] = useState(generateRandomBins(20));
  const [userPos, setUserPos] = useState(null);

  // --- Update bins every 15 seconds ---
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Updating bins...');
      setBins(generateRandomBins(20));
    }, 15000); // every 15s
    return () => clearInterval(interval);
  }, []);

  // --- Get user location (for reference only) ---
  useEffect(() => {
    function getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setUserPos({ lat: latitude, lng: longitude });
          },
          (err) => console.error('Geolocation error:', err),
          { enableHighAccuracy: true }
        );
      }
    }

    getUserLocation();
    const gpsInterval = setInterval(getUserLocation, 15000); // update every 15s
    return () => clearInterval(gpsInterval);
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[-1.286389, 36.817223]} // Nairobi CBD
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Bin markers */}
        {bins.map((bin) => (
          <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={getIconByStatus(bin.status)}>
            <Popup>
              <strong>{bin.name}</strong> <br />
              Status: {bin.status}
            </Popup>
          </Marker>
        ))}
        {/* Show GPS position (not part of your work) */}
        {userPos && (
          <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        <FitBounds markers={bins} />
      </MapContainer>
    </div>
  );
}
