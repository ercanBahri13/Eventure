// frontend/src/screens/EventDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function EventDetailScreen({ route, navigation }) {
  const { eventId, userId } = route.params || {};
  const [eventData, setEventData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSingleEvent();
  }, []);

  const fetchSingleEvent = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEventData(data);
      } else {
        Alert.alert('Error', 'Could not fetch event.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSaveEvent = async () => {
    if (!userId) {
      Alert.alert('Not logged in', 'Please log in first!');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:8080/auth/save-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId: eventData.id }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Event saved successfully!');
      } else {
        const errorMsg = await response.text();
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleRegisterEvent = async () => {
    if (!userId) {
      Alert.alert('Not logged in', 'Please log in first!');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:8080/auth/register-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId: eventData.id }),
      });
      if (response.ok) {
        Alert.alert('Success', 'You have registered for this event!');
      } else {
        const errorMsg = await response.text();
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  if (!eventData) {
    return (
      <View style={styles.container}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {eventData.imageUrl && (
        <Image source={{ uri: eventData.imageUrl }} style={styles.image} />
      )}
      <Text style={styles.title}>{eventData.name}</Text>
      <Text>Type: {eventData.type}</Text>
      <Text>Date: {eventData.date}</Text>
      <Text>
        Time: {eventData.startTime} - {eventData.endTime}
      </Text>
      <Text>
        Location: {eventData.location}, {eventData.city}
      </Text>
      <Text>Capacity: {eventData.capacity}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Save Event" onPress={handleSaveEvent} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Register Event" onPress={handleRegisterEvent} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Show Location"
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Modal for showing the map */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.mapModalContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: eventData.latitude,
              longitude: eventData.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: eventData.latitude,
                longitude: eventData.longitude,
              }}
              title={eventData.name}
              description={eventData.location}
            />
          </MapView>
          <View style={styles.closeButtonContainer}>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: '100%', height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  buttonContainer: { marginVertical: 10 },
  mapModalContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
    overflow: 'hidden',
  },
});
