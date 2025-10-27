import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapsAndNotifications.css';

// Custom icons
const redIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const greenIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const yellowIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const getIconByStatus = (status) => {
  const s = status?.toLowerCase().trim();
  switch (s) {
    case 'full': return redIcon;
    case 'empty': return greenIcon;
    case 'pending': return yellowIcon;
    default: return greenIcon;
  }
};

// Fit map to all markers
function FitBounds({ bins }) {
  const map = useMap();
  useEffect(() => {
    if (bins.length > 0) {
      const bounds = bins.map(bin => [Number(bin.lat), Number(bin.lng)]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bins, map]);
  return null;
}

export default function MapsAndNotifications() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBins = async () => {
    try {
      const response = await fetch('http://localhost:5000/bins');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      const validBins = Array.isArray(data) ? data.filter(b => b.lat && b.lng) : [];
      setBins(validBins);
    } catch (error) {
      console.error('Error fetching bins:', error.message);
      setBins([]); // empty if fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
    const interval = setInterval(fetchBins, 15000);
    return () => clearInterval(interval);
  }, []);

  // Log full bins
  useEffect(() => {
    const fullBins = bins.filter(b => b.status?.toLowerCase().trim() === 'full');
    if (fullBins.length > 0) {
      fullBins.forEach(bin => {
        console.log(` Bin ${bin.id} is FULL at area: ${bin.area}`);
      });
    }
  }, [bins]);

  return (
    <div className="map-container">
      {loading ? (
        <p>Loading bins on the map...</p>
      ) : (
        <MapContainer scrollWheelZoom style={{ height: '500px', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bins.map(bin => (
            <Marker
              key={bin.id}
              position={[Number(bin.lat), Number(bin.lng)]}
              icon={getIconByStatus(bin.status)}
            >
              <Popup>
                <strong>Bin {bin.id}</strong> <br />
                Status: {bin.status} <br />
                Area: {bin.area}
              </Popup>
            </Marker>
          ))}
          <FitBounds bins={bins} />
        </MapContainer>
      )}
    </div>
  );
}
