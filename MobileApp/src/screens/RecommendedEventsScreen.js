import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function RecommendedEventsScreen({ navigation, route }) {
  const userId = route.params?.userId;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      try {
        const threshold = 0.7;
        console.log(`Fetching: http://10.0.2.2:8080/api/match/user/${userId}?threshold=${threshold}`);

        const response = await fetch(`http://10.0.2.2:8080/api/match/user/${userId}?threshold=${threshold}`);
            console.log('Matched Event IDs response status:', response.status); // Debugging line
        const matchedEventIds = await response.json();
            console.log('Matched Event IDs:', matchedEventIds); // Debugging line

        const eventResponses = await Promise.all(
          matchedEventIds.map(eventId =>
            fetch(`http://10.0.2.2:8080/events/${eventId}).then(res => res.json()`)
          )
        );

        setEvents(eventResponses);
      } catch (error) {
        console.warn('Failed to fetch recommended events:', error);
      }
    };

    fetchRecommendedEvents();
  }, [userId]);

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() =>
        navigation.navigate('EventDetail', {
          eventId: item.id,
          userId,
        })
      }
    >
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
      <Text style={styles.title}>Recommended Events</Text>
      <FlatList
      removeClippedSubviews={false}
        data={events}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
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
  eventDate: { color: '#555', marginTop:2},
});