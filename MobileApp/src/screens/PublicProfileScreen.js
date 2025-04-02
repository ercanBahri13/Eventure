// frontend/src/screens/PublicProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

export default function PublicProfileScreen({ route, navigation }) {
  const { viewedUserId, currentUserId } = route.params || {};
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/users/${viewedUserId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        const msg = await response.text();
        setError(msg);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // We show only "Registered Events" + "Created Events".
  const registeredEvents = userData.registeredEvents || [];
  const createdEvents = userData.createdEvents || [];

  // Optional: Add a "Send Friend Request" button here if you want:
  // e.g. a function that calls /friend-requests

  return (
    <View style={styles.container}>
      {userData.profileImage ? (
        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      ) : (
        <Image source={require('../../assets/logo.png')} style={styles.profileImage} />
      )}

      <Text style={styles.name}>
        {userData.name} {userData.surname}
      </Text>
      <Text style={styles.info}>Email: {userData.email}</Text>
      <Text style={styles.info}>Phone: {userData.phoneNumber}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('FriendList', { userId: viewedUserId, currentUserId })}>
        <Text style={styles.friends}>
         Friends: {userData.friends ? userData.friends.length : 0}
         </Text>
      </TouchableOpacity>

      {/* Display Registered Events */}
      <Text style={styles.sectionTitle}>Registered Events</Text>
      <FlatList
        data={registeredEvents}
        keyExtractor={(item, index) => String(item.id ?? index)}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('EventDetail', {
              eventId: item.id,
              userId: currentUserId,  // your logged in user
            })}
          >
            <Text style={styles.eventName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {/* Display Created Events */}
      <Text style={styles.sectionTitle}>Created Events</Text>
      <FlatList
        data={createdEvents}
        keyExtractor={(item, index) => String(item.id ?? index)}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('EventDetail', {
              eventId: item.id,
              userId: currentUserId,
            })}
          >
            <Text style={styles.eventName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  profileImage: {
    width: 120, height: 120, borderRadius: 60, marginVertical: 20
  },
  name: { fontSize: 22, fontWeight: 'bold' },
  info: { fontSize: 16, marginVertical: 2 },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold',
    marginTop: 20, alignSelf: 'flex-start'
  },
  eventItem: {
    backgroundColor: '#f2f2f2', padding: 10,
    margin: 5, borderRadius: 5
  },
  eventName: { fontWeight: 'bold' }
});
