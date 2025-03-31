import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';


export default function ProfileScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [userData, setUserData] = useState(null);

  useFocusEffect(
      useCallback(() => {
        fetchUserProfile();
      }, [])
    );

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        Alert.alert('Error', 'Could not fetch user profile.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userId: userId, userData });
  };

  const handleFriendsPress = () => {
    // Navigate to a FriendListScreen or display in a modal
    navigation.navigate('FriendList', { userId });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // We'll extract savedEvents and registeredEvents
  const savedEvents = userData.savedEvents || [];
  const registeredEvents = userData.registeredEvents || [];

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      {userData.profileImage ? (
        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      ) : (
        <Image source={require('../../assets/logo.png')} style={styles.profileImage} />
      )}

      {/* Basic Info */}
      <Text style={styles.name}>{userData.name} {userData.surname}</Text>
      <Text style={styles.info}>Email: {userData.email}</Text>
      <Text style={styles.info}>Phone: {userData.phoneNumber}</Text>

      {/* Friends Count */}
      <TouchableOpacity onPress={handleFriendsPress}>
        <Text style={styles.friends}>
          Friends: {userData.friends ? userData.friends.length : 0}
        </Text>
      </TouchableOpacity>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Display Saved Events */}
      <Text style={styles.sectionTitle}>Saved Events</Text>
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id, userId })}
          >
            <Text style={styles.eventName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Display Registered Events */}
      <Text style={styles.sectionTitle}>Registered Events</Text>
      <FlatList
        data={registeredEvents}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id, userId })}
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
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 20
  },
  name: { fontSize: 22, fontWeight: 'bold' },
  info: { fontSize: 16, marginVertical: 2 },
  friends: {
    fontSize: 16,
    color: 'blue',
    marginTop: 8
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6,
    marginTop: 10
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start'
  },
  eventItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    margin: 5,
    borderRadius: 5
  },
  eventName: { fontWeight: 'bold' }
});
