// frontend/src/screens/PublicProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';

export default function PublicProfileScreen({ route, navigation }) {
  const { viewedUserId, currentUserId } = route.params || {};
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const resp = await fetch(`http://10.0.2.2:8080/users/${viewedUserId}`);
      if (!resp.ok) throw new Error(await resp.text());
      setUserData(await resp.json());
    } catch (e) {
      setError(e.message);
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

  const registeredEvents = userData.registeredEvents || [];
  const createdEvents    = userData.createdEvents    || [];

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      {userData.profileImage ? (
        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      ) : (
        <Image source={require('../../assets/logo.png')} style={styles.profileImage} />
      )}

      {/* Basic Info */}
      <Text style={styles.name}>
        {userData.name} {userData.surname}
      </Text>
      <Text style={styles.info}>Email: {userData.email}</Text>
      <Text style={styles.info}>Phone: {userData.phoneNumber}</Text>

      {/* Friends Count */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('FriendList', {
            userId: viewedUserId,
            currentUserId
          })
        }
      >
        <Text style={styles.friends}>Friends</Text>
      </TouchableOpacity>

      {/* Registered Events */}
      <Text style={styles.sectionTitle}>Registered Events</Text>
      <FlatList
        removeClippedSubviews={false}
        data={registeredEvents}
        keyExtractor={item => String(item.id)}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() =>
              navigation.navigate('EventDetail', {
                eventId: item.id,
                userId: currentUserId
              })
            }
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            ) : (
              <Image source={require('../../assets/logo.png')} style={styles.eventImage} />
            )}
            <Text style={styles.eventName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Created Events */}
      <Text style={styles.sectionTitle}>Created Events</Text>
      <FlatList
        removeClippedSubviews={false}
        data={createdEvents}
        keyExtractor={item => String(item.id)}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() =>
              navigation.navigate('EventDetail', {
                eventId: item.id,
                userId: currentUserId
              })
            }
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            ) : (
              <Image source={require('../../assets/logo.png')} style={styles.eventImage} />
            )}
            <Text style={styles.eventName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  profileImage:  { width: 120, height: 120, borderRadius: 60, marginVertical: 20 },
  name:          { fontSize: 22, fontWeight: 'bold' },
  info:          { fontSize: 16, marginVertical: 2 },
  friends:       { fontSize: 16, color: 'blue', marginTop: 8 },
  sectionTitle:  { fontSize: 18, fontWeight: 'bold', marginTop: 20, alignSelf: 'flex-start' },
  eventItem:     {
    width: 120,
    marginRight: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center'
  },
  eventImage:    { width: '100%', height: 80, resizeMode: 'cover' },
  eventName:     { fontWeight: 'bold', marginTop: 5, textAlign: 'center' }
});
