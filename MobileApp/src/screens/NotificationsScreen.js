// frontend/src/screens/NotificationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  Alert, TouchableOpacity, ActivityIndicator
} from 'react-native';
import moment from 'moment';

export default function NotificationsScreen({ route }) {
  const { userId } = route.params || {};
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // 1) Fetch friend requests
      const friendResp  = await fetch(`http://10.0.2.2:8080/friend-requests/${userId}`);
      // 2) Fetch mention notifications
      const mentionResp = await fetch(`http://10.0.2.2:8080/notifications/${userId}`);

      if (!friendResp.ok || !mentionResp.ok) {
        throw new Error('Failed to load notifications');
      }

      const friendData  = await friendResp.json();   // [{id, fromUser:{username,…}, …},…]
      const mentionData = await mentionResp.json();  // [{id, message, createdAt, …},…]

      // Tag each entry:
      const friendRequests = (friendData || []).map(fr => ({
        ...fr,
        type: 'friend',
        createdAt: fr.createdAt || fr.timestamp || new Date().toISOString()
      }));
      const mentions = (mentionData || []).map(m => ({
        ...m,
        type: 'mention'
      }));

      // Combine & sort newest first:
      const combined = [...friendRequests, ...mentions].sort((a,b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setItems(combined);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Handler for friend-request Accept
  const handleAccept = async id => {
    try {
      const res = await fetch(`http://10.0.2.2:8080/friend-requests/${id}/accept`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(await res.text());
      fetchAll();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Handler for friend-request Reject
  const handleReject = async id => {
    try {
      const res = await fetch(`http://10.0.2.2:8080/friend-requests/${id}/reject`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(await res.text());
      fetchAll();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Handler to mark a mention notification as read
  const handleMarkRead = async notifId => {
    try {
      const res = await fetch(
        `http://10.0.2.2:8080/notifications/${notifId}/read`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(await res.text());
      fetchAll();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Render each row
  const renderItem = ({ item }) => {
    if (item.type === 'friend') {
      const fromUsername = item.fromUser?.username || 'Someone';
      return (
        <View style={styles.requestItem}>
          <Text style={styles.requestText}>
            {fromUsername} sent you a friend request.
          </Text>
          <Text style={styles.time}>
            {moment(item.createdAt).fromNow()}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => handleAccept(item.id)}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // mention notification
      return (
        <View style={styles.requestItem}>
          <Text style={styles.requestText}>
            {item.message}
          </Text>
          <Text style={styles.time}>
            {moment(item.createdAt).fromNow()}
          </Text>
          <TouchableOpacity
            style={styles.markReadBtn}
            onPress={() => handleMarkRead(item.id)}
          >
            <Text style={styles.markReadText}>Mark read</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#666" style={{marginTop:20}}/>
      ) : (
        <FlatList
          removeClippedSubviews={false}
          data={items}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>You’re all caught up!</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  title:     { fontSize:22, fontWeight:'bold', marginBottom:12 },
  requestItem:{
    backgroundColor:'#f2f2f2',
    padding:12,
    borderRadius:6,
    marginBottom:10
  },
  requestText:{ fontSize:16 },
  time:       { fontSize:12, color:'#888', marginTop:4 },
  actions:    { flexDirection:'row', marginTop:10, justifyContent:'space-around' },
  acceptBtn:  { backgroundColor:'green', padding:8, borderRadius:4 },
  rejectBtn:  { backgroundColor:'red',   padding:8, borderRadius:4 },
  btnText:    { color:'#fff', fontWeight:'bold' },
  markReadBtn:{ marginTop:8, alignSelf:'flex-end' },
  markReadText:{ color:'blue' },
  empty:      { textAlign:'center', marginTop:40, color:'#666' }
});
