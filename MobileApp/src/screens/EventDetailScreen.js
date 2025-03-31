// frontend/src/screens/EventDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';

export default function EventDetailScreen({ route, navigation }) {
  const { eventId, userId } = route.params || {};
  const [eventData, setEventData] = useState(null);

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
      {eventData.imageUrl ? (
        <Image source={{ uri: eventData.imageUrl }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{eventData.name}</Text>
      <Text>Type: {eventData.type}</Text>
      <Text>Date: {eventData.date}</Text>
      <Text>Time: {eventData.startTime} - {eventData.endTime}</Text>
      <Text>Location: {eventData.location}, {eventData.city}</Text>
      <Text>Capacity: {eventData.capacity}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Save Event" onPress={handleSaveEvent} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Register Event" onPress={handleRegisterEvent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: '100%', height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  buttonContainer: { marginVertical: 10 },
});
