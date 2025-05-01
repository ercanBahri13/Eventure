import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  FlatList, TouchableOpacity, Alert
} from 'react-native';

export default function SearchFriendsScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/users/search?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        const errMsg = await response.text();
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const sendFriendRequest = async (toUserId) => {
    try {
      const resp = await fetch('http://10.0.2.2:8080/friend-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: userId, toUserId })
      });
      if (resp.ok) {
        Alert.alert('Success', 'Friend request sent!');
      } else {
        const errMsg = await resp.text();
        Alert.alert('Error', errMsg);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderUserItem = ({ item }) => {
    if (item.id === userId) {
      // skip if it's you? or show a message that it's you
      return null;
    }
    return (
      <View style={styles.userItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PublicProfile', { viewedUserId: item.id, currentUserId: userId })}
        >
          <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => sendFriendRequest(item.id)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Friends</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter name or username"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        removeClippedSubviews={false}
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  searchRow: { flexDirection: 'row' },
  input: {
    flex: 1, borderWidth: 1,
    borderColor: '#ccc', borderRadius: 5,
    padding: 8
  },
  searchBtn: {
    backgroundColor: 'blue', marginLeft: 8,
    borderRadius: 5, paddingHorizontal: 12,
    justifyContent: 'center'
  },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  userItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 10,
    borderBottomWidth: 1, borderColor: '#ccc'
  },
  username: { fontSize: 16 },
  addButton: {
    backgroundColor: 'green',
    width: 30, height: 30,
    borderRadius: 15, alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: { color: '#fff', fontSize: 18 }
});
