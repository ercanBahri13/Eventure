// frontend/src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const [events, setEvents] = useState([]);
  const user = route.params?.user;
  const userId = user?.id;
  //const {userId } = route.params || {};

  const fetchEvents = async (query = '') => {
    try {
      let url = 'http://10.0.2.2:8080/events';
      if (query) {
        url += `?search=${encodeURIComponent(query)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.warn('Failed to fetch events', error);
    }
  };

  useEffect(() => {
    // Load events on initial render
    fetchEvents();
  }, []);

  const handleSearch = () => {
    fetchEvents(searchText);
  };

  const handleLogout = () => {
    // For now, just navigate back to Welcome
    navigation.navigate('Welcome');
  };
/*
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      {}
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      ) : null}
      <View style={styles.eventDetails}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventLocation}>{item.location} - {item.city}</Text>
        <Text style={styles.eventDate}>{item.date} ({item.startTime} - {item.endTime})</Text>
      </View>
    </View>
  );
*/
const renderEventItem = ({ item }) => (
  <TouchableOpacity
    style={styles.eventItem}
    onPress={() =>
      navigation.navigate('EventDetail', {
        eventId: item.id,
        userId: userId, // Replace with actual userId
      })
    }
  >
    {/* If there's an imageUrl, display it */}
    {item.imageUrl ? (
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
    ) : null}
    <View style={styles.eventDetails}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventLocation}>{item.location} - {item.city}</Text>
      <Text style={styles.eventDate}>{item.date} ({item.startTime} - {item.endTime})</Text>
    </View>
  </TouchableOpacity>
);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventure</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events by name..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => navigation.navigate('Profile', { userId })}
            style={[styles.logoutButton, { backgroundColor: 'blue', marginTop: 10 }]}
          >
            <Text style={styles.logoutText}>Profile</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },

  searchContainer: { flexDirection: 'row', marginVertical: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    borderRadius: 5,
    padding: 8
  },

  listContent: { paddingBottom: 20 },

  eventItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    overflow: 'hidden'
  },
  eventImage: { width: 80, height: 80, resizeMode: 'cover' },
  eventDetails: { flex: 1, padding: 10 },
  eventName: { fontWeight: 'bold', fontSize: 16 },
  eventLocation: { color: '#555', marginTop: 5 },
  eventDate: { color: '#555', marginTop: 2 },

  logoutContainer: { marginVertical: 10, alignItems: 'center' },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5
  },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});
