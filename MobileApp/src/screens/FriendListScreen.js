// frontend/src/screens/FriendListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function FriendListScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
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

  const renderFriend = ({ item }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => {
      // Possibly navigate to that friend's profile?
      navigation.navigate('Profile', { userId: item.id });
    }}>
      <Text style={styles.friendName}>{item.name} {item.surname}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFriend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  friendName: {
    fontSize: 16
  }
});
