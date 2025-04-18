// frontend/src/screens/NotificationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function NotificationsScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/friend-requests/${userId}`);
      if (!response.ok) {
        const errorMsg = await response.text();
        Alert.alert('Error', errorMsg);
        return;
      }
      const data = await response.json();
      // Filter out any items that have no ID or fromUser
      const safeData = data.filter(item => item && item.id);
      setRequests(safeData);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/friend-requests/${requestId}/accept`, {
        method: 'POST'
      });
      if (response.ok) {
        Alert.alert('Success', 'Friend request accepted!');
        fetchRequests(); // Refresh
      } else {
        const errorMsg = await response.text();
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/friend-requests/${requestId}/reject`, {
        method: 'POST'
      });
      if (response.ok) {
        Alert.alert('Rejected', 'Friend request rejected.');
        fetchRequests();
      } else {
        const errorMsg = await response.text();
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderRequest = ({ item }) => {
    // item.fromUser or item.toUser might be null or undefined
    const fromUsername = item.fromUser?.username || 'Unknown';
    return (
      <View style={styles.requestItem}>
        <Text style={styles.requestText}>
          {fromUsername} wants to be your friend.
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={requests}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={renderRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  requestItem: {
    backgroundColor: '#f2f2f2', padding: 10,
    marginVertical: 5, borderRadius: 5
  },
  requestText: { fontSize: 16 },
  actions: {
    flexDirection: 'row', marginTop: 10,
    justifyContent: 'space-evenly'
  },
  acceptBtn: {
    backgroundColor: 'green', padding: 8,
    borderRadius: 5
  },
  rejectBtn: {
    backgroundColor: 'red', padding: 8,
    borderRadius: 5
  },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
