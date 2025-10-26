import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Define bin type
type Bin = {
  id: number;
  lat: number;
  lng: number;
  status: string;
  area?: string;
};

export default function MapsAndNotifications() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch bins from backend
  const fetchBins = async () => {
    try {
      const response = await fetch('http://localhost:5000/bins');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setBins(data);
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Error fetching bins:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();

    // Poll every 15 seconds for updates
    const interval = setInterval(fetchBins, 15000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Alert user for full bins
  useEffect(() => {
    const fullBins = bins.filter(bin => bin.status?.toLowerCase() === 'full');
    if (fullBins.length > 0) {
      Alert.alert('⚠️ Full Bin Alert', `${fullBins.length} bin(s) are full!`);
    }
  }, [bins]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text>Loading bins on the map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -1.2921,
          longitude: 36.8219,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {bins.map(bin => (
          <Marker
            key={bin.id}
            coordinate={{
              latitude: bin.lat,
              longitude: bin.lng,
            }}
            pinColor={
              bin.status === 'Full'
                ? 'red'
                : bin.status === 'Empty'
                ? 'green'
                : 'orange'
            }
            title={`Bin ${bin.id}`}
            description={`Status: ${bin.status} — Area: ${bin.area || 'Unknown'}`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
