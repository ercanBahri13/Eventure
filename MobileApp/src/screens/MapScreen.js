// frontend/src/screens/MapScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationPerm, setLocationPerm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mapRef = useRef(null);

  // 1. Request Android location permission at runtime
  useEffect(() => {
    async function requestPermission() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Eventure Location Permission',
              message: 'Eventure needs your location to show it on the map.',
              buttonPositive: 'OK',
            }
          );
          setLocationPerm(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn(err);
        }
      } else {
        // iOS: assuming you added NSLocationWhenInUseUsageDescription in Info.plist
        setLocationPerm(true);
      }
    }
    requestPermission();
  }, []);

  // fetch events…
  useEffect(() => {
    fetch('http://10.0.2.2:8080/events')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load events');
        return res.json();
      })
      .then(data => setEvents(data))
      .catch(err => {
        console.error(err);
        Alert.alert('Error', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // center on first event
  useEffect(() => {
    if (events.length && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: events[0].latitude,
        longitude: events[0].longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 500);
    }
  }, [events]);

  const goToNextEvent = () => {
    if (!events.length || !mapRef.current) return;
    const nextIndex = (currentIndex + 1) % events.length;
    setCurrentIndex(nextIndex);
    const evt = events[nextIndex];
    mapRef.current.animateToRegion({
      latitude: evt.latitude,
      longitude: evt.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 500);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const initialRegion = events.length
    ? {
        latitude: events[0].latitude,
        longitude: events[0].longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventure Map Demo</Text>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={locationPerm}
        showsMyLocationButton={locationPerm}
      >
        {events.map(evt => (
          <Marker
            key={evt.id}
            identifier={evt.id.toString()}
            coordinate={{
              latitude: evt.latitude,
              longitude: evt.longitude,
            }}
            title={evt.name}
            description={`${evt.location}, ${evt.city}`}
          />
        ))}
      </MapView>

      <View style={styles.controlContainer}>
        <Button title="Next Event" onPress={goToNextEvent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  map: { flex: 1 },
  controlContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
