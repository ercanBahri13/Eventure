import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import Feather from 'react-native-vector-icons/Feather';

export default function ProfileScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      console.log('👤 ProfileScreen mounted');
      return () => console.log('👤 ProfileScreen unmounted');
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
    navigation.navigate('FriendList', { userId });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const savedEvents = userData.savedEvents || [];
  const registeredEvents = userData.registeredEvents || [];
  const createdEvents = userData.createdEvents || [];

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
          Friends {userData.friends}
        </Text>
      </TouchableOpacity>


      {/* Display Saved Events */}
      <Text style={styles.sectionTitle}>Saved Events</Text>
      <FlatList
        removeClippedSubviews={false}
        data={savedEvents}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id, userId })}
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

      <Text style={styles.sectionTitle}>Registered Events</Text>
           <FlatList


             removeClippedSubviews={false}


             data={registeredEvents}
             keyExtractor={(item) => item.id.toString()}
             horizontal
             renderItem={({ item }) => (
               <TouchableOpacity
                 style={styles.eventItem}
                 onPress={() => navigation.navigate('EventDetail', { eventId: item.id, userId })}
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


        <Text style={styles.sectionTitle}>Created Events</Text>
              <FlatList

                removeClippedSubviews={false}


                data={createdEvents}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.eventItem}
                    onPress={() => navigation.navigate('EventDetail', { eventId: item.id, userId })}
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


      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="home" size={28} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleEditProfile}
        >
          <Feather name="edit-2" size={28} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('SearchFriends', {userId})}
        >
          <Feather name="user-plus" size={28} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Feather name="log-out" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginVertical: 20 },
  name: { fontSize: 22, fontWeight: 'bold' },
  info: { fontSize: 16, marginVertical: 2 },
  friends: { fontSize: 16, color: 'blue', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, alignSelf: 'flex-start' },
  eventItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    width: 120,
  },
  eventName: { fontWeight: 'bold' },
  eventImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },

  /* ==== new bottom navigation styles ==== */
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
