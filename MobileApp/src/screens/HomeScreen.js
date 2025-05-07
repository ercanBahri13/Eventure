// frontend/src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {  Alert, View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import Geolocation from '@react-native-community/geolocation';


export default function HomeScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const [events, setEvents] = useState([]);
  const user = route.params?.user;
  const userId = user?.id;
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const username = user?.username;
  const phone    = user?.phoneNumber;

  //const {userId } = route.params || {};

  const fetchEvents = async (query = '') => {
    try {
      let url = 'http://10.0.2.2:8080/events';
      if (query) {
        url += `?search=${encodeURIComponent(query)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.warn('Failed to fetch events', error);
    }
  };

  useEffect(() => {
    // Load events on initial render
    fetchEvents();
    console.log('🏠 HomeScreen mounted');
    return () => console.log('🏠 HomeScreen unmounted');

  }, []);

  const handleSearch = () => {
    fetchEvents(searchText);
  };

  const handleLogout = () => {
    // For now, just navigate back to Welcome
    navigation.navigate('Welcome');
  };
  // ─── SAFETY button handler
  const sendSafetyAlert = () => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 Got location:", latitude, longitude);
        try {
          console.log("📡 Sending POST /safety-alert …");
          const res = await fetch('http://10.0.2.2:8080/safety-alert', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ userId, latitude, longitude })
          });
           console.log("📨 Response status:", res.status);
           const text = await res.text();
           console.log("📨 Response body:", text);
           if (res.ok) Alert.alert('Sent', 'Safety alert e-mail sent.');
           else Alert.alert('Error', await res.text());
         } catch (err) {
           console.error("⚠️ Fetch failed:", err);
           Alert.alert('Error', err.message);
         }
       },
        err => {
          console.error("⚠️ Geolocation error:", err);
          Alert.alert('Location error', err.message);
        },
        { enableHighAccuracy:true, timeout:10000, maximumAge:10000 }
      );
    };

const renderEventItem = ({ item }) => (
  <TouchableOpacity
    style={styles.eventItem}
    onPress={() =>
      navigation.navigate('EventDetail', {
        eventId: item.id,
        userId: userId, // Replace with actual userId
      })
    }
  >

   {/* If there's an imageUrl, display it */}
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
// This renders an event item that navigates to MapScreen
const renderMapItem = ({ item }) => (
  <TouchableOpacity
    style={styles.eventItem}
    onPress={() =>
      navigation.navigate('MapScreen', {
        eventId: item.id,
        userId: userId,
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
      <Text style={styles.title}>Eventure</Text>



      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events by name..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={typeFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setTypeFilter(itemValue)}
        >
          <Picker.Item label="All Types" value="" />
          <Picker.Item label="Festival" value="Festival" />
          <Picker.Item label="Concert" value="Concert" />
          <Picker.Item label="Theatre" value="Theatre" />
          <Picker.Item label="Food festival" value="Food festival" />
          {/* Add more types if you have */}
        </Picker>

        <Picker
          selectedValue={cityFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setCityFilter(itemValue)}
        >
          <Picker.Item label="All Cities" value="" />
          <Picker.Item label="Ankara" value="Ankara" />
          <Picker.Item label="Istanbul" value="Istanbul" />
          <Picker.Item label="Austin" value="Austin" />
          {/* Add more cities */}
        </Picker>
      </View>

      <FlatList


        removeClippedSubviews={false}

        data={events.filter(event => {
          const matchType = typeFilter ? event.type.toLowerCase() === typeFilter.toLowerCase() : true;
          const matchCity = cityFilter ? event.city.toLowerCase() === cityFilter.toLowerCase() : true;
          return matchType && matchCity;
        })}

        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={renderEventItem} //renderEventItem
        contentContainerStyle={styles.listContent}
      />


     <View style={styles.navBar}>
       <TouchableOpacity style={styles.navButton} onPress={sendSafetyAlert}>
         <Text style={{fontSize:18, color:'red'}}>SOS</Text>
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.navButton}
         onPress={() => navigation.navigate('Profile', { userId })}
       >
         <Feather name="user" size={28} />
       </TouchableOpacity>



       <TouchableOpacity
         style={styles.navButton}
         onPress={() => navigation.navigate('CreateEvent', { userId })}
       >
         <Feather name="plus-circle" size={28} />
       </TouchableOpacity>

       <TouchableOpacity
         style={styles.navButton}
         onPress={() => navigation.navigate('MapScreen')}
       >
         <Feather name="map" size={28} />
       </TouchableOpacity>

        <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Notifications', { userId })}
              >
                <Feather name="bell" size={28} />
        </TouchableOpacity>
     </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },

  searchContainer: { flexDirection: 'row', marginVertical: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    borderRadius: 5,
    padding: 8
  },

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
  eventDate: { color: '#555', marginTop: 2 },


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
        paddingHorizontal: 20,
    },
    navButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationIcon: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 10,
    },
    addFriendButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#2196F3',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
});
