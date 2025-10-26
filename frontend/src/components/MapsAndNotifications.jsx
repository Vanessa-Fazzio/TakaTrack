import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapsAndNotifications.css';

//Custom icons based on bin status
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

export default function MapsAndNotifications() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bins from backend
  const fetchBins = async () => {
    try {
      const response = await fetch('http://localhost:5000/bins'); // 👈 Replace 'localhost' with your IP if using Expo Go
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      // JSON Server already returns an array
      const validBins = Array.isArray(data) ? data.filter(b => b.lat && b.lng) : [];
      setBins(validBins);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bins:', error.message);
      setBins([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
    const interval = setInterval(fetchBins, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // Notify in console when bins are full
  useEffect(() => {
    const fullBins = bins.filter(bin => bin.status?.toLowerCase() === 'full');
    if (fullBins.length > 0) {
      console.log(`⚠️ ${fullBins.length} bin(s) are full!`);
    }
  }, [bins]);

  // Helper: choose icon color based on status
  const getIconByStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'full':
        return redIcon;
      case 'empty':
        return greenIcon;
      case 'pending':
        return yellowIcon;
      default:
        return greenIcon;
    }
  };

  return (
    <div className="map-container">
      {loading ? (
        <p>Loading bins on the map...</p>
      ) : (
        <MapContainer
          center={[-1.2921, 36.8219]} // Nairobi center
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {bins.length === 0 ? (
            <Popup position={[-1.2921, 36.8219]}>
              No bins available.
            </Popup>
          ) : (
            bins.map(bin => (
              <Marker
                key={bin.id}
                position={[bin.lat, bin.lng]}
                icon={getIconByStatus(bin.status)}
              >
                <Popup>
                  <strong>Bin {bin.id}</strong> <br />
                  Status: {bin.status} <br />
                  Area: {bin.area || 'Unknown'}
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      )}
    </div>
  );
}
