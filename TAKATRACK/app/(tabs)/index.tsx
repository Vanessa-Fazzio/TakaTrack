import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import MapsAndNotifications from '../components/MapsAndNotifications';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TakaTrack — Maps & Notifications</Text>
      <View style={{ flex: 1 }}>
        <MapsAndNotifications />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  title: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
