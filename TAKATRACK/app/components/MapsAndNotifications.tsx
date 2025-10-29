import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapsAndNotifications() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bins from your backend
  const fetchBins = async () => {
    try {
      const response = await fetch('http://localhost:5000/bins');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setBins(data);
      setLoading(false);

      // Alert for full bins
      data.forEach((bin: any) => {
        if (bin.status?.toLowerCase() === 'full') {
          Alert.alert('Full Bin', `Bin ${bin.id} is full!`);
        }
      });
    } catch (error) {
      console.error('Error fetching bins:', error);
      setLoading(false);
      Alert.alert('Error', 'Could not fetch bin data.');
    }
  };

  useEffect(() => {
    fetchBins();
    const interval = setInterval(fetchBins, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading || bins.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading bins...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: bins[0].lat,
        longitude: bins[0].lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {bins.map((bin) => (
        <Marker
          key={bin.id}
          coordinate={{ latitude: bin.lat, longitude: bin.lng }}
          title={`Bin ${bin.id}`}
          description={`Status: ${bin.status} — ${bin.area || 'Unknown'}`}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
