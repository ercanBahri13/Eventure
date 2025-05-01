import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function CreateEventScreen({ route, navigation }) {
  const { userId } = route.params || {};

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('2025-05-01'); // format: YYYY-MM-DD
  const [startTime, setStartTime] = useState('10:00:00'); // HH:mm:ss
  const [endTime, setEndTime] = useState('12:00:00');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('50');
  const [imageUrl, setImageUrl] = useState('');
  const [latitude, setLatitude]   = useState('');
  const [longitude, setLongitude] = useState('');

  const handleCreateEvent = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          name,
          type,
          date,
          startTime,
          endTime,
          city,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          location,
          capacity: parseInt(capacity),
          imageUrl
        }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Event created!');
        navigation.goBack();
      } else {
        const err = await response.text();
        Alert.alert('Error', err);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event</Text>
      <TextInput style={styles.input} placeholder="Event Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Type (Concert, etc.)" value={type} onChangeText={setType} />
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Start Time (HH:mm:ss)" value={startTime} onChangeText={setStartTime} />
      <TextInput style={styles.input} placeholder="End Time (HH:mm:ss)" value={endTime} onChangeText={setEndTime} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Capacity" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} />
      <TextInput style={styles.input} placeholder="Latitude (e.g. 41.0082)" value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Longitude (e.g. 28.9784)" value={longitude} onChangeText={setLongitude} keyboardType="numeric" />

      <Button title="Save Event" onPress={handleCreateEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 8, marginVertical: 8, borderRadius: 5
  }
});
