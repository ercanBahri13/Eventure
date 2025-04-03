// frontend/src/screens/FriendListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image
} from 'react-native';

export default function FriendListScreen({ route, navigation }) {
  // We'll expect both userId (whose friend list we are viewing)
  // and currentUserId (the logged in user)
  const { userId, currentUserId } = route.params || {};
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      // This calls GET /users/{userId}/friends
      // Make sure your backend endpoint returns a list of friend users with
      // { id, username, profileImage, ... } so we can display them
      const response = await fetch(`http://10.0.2.2:8080/users/${userId}/friends`);
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      } else {
        Alert.alert('Error', 'Could not fetch friend list.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // We define the item rendering inline
  const renderFriendItem = ({ item, index }) => {
    // Each 'item' is a User object, presumably with id, username, profileImage, etc.
    // We'll navigate to PublicProfile when tapped.
    return (
      <TouchableOpacity
        style={styles.friendItem}
        onPress={() =>
          navigation.navigate('PublicProfile', {
            viewedUserId: item.id,   // The friend we tapped
            currentUserId: currentUserId, // The logged in user
          })
        }
      >
        {/* Show the friend's profile image, fallback to a local asset */}
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.friendImage} />
        ) : (
          <Image source={require('../../assets/logo.png')} style={styles.friendImage} />
        )}
        {/* Show the friend's username or name */}
        <Text style={styles.friendText}>
          {item.username ? item.username : `${item.name} ${item.surname}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FlatList
        data={friends}
        // We use a "safe" keyExtractor so if item.id is missing, fallback to index
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={renderFriendItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  friendText: {
    fontSize: 16
  }
});
