import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [userData, setUserData] = useState(null);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [addPhotoModalVisible, setAddPhotoModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [navigation])
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

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    launchImageLibrary(options, async (response) => {
      if (!response.didCancel && response.assets?.length > 0) {
        const asset = response.assets[0];

        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          name: asset.fileName || 'profile.jpg',
          type: asset.type || 'image/jpeg',
        });

        try {
          const res = await fetch(`http://10.0.2.2:8080/users/${userId}/upload-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData,
          });

          const imageUrl = await res.text();

          await fetch(`http://10.0.2.2:8080/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileImage: imageUrl }),
          });

          fetchUserProfile(); // refresh
          setAddPhotoModalVisible(false);
        } catch (err) {
          Alert.alert('Upload failed', err.message);
        }
      }
    });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const imageToShow = userData.profileImage;

  const savedEvents = userData.savedEvents || [];
  const registeredEvents = userData.registeredEvents || [];
  const createdEvents = userData.createdEvents || [];

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <TouchableOpacity
        onPress={() => {
          if (imageToShow) {
            setFullImageVisible(true);
          } else {
            setAddPhotoModalVisible(true);
          }
        }}
      >
        {imageToShow ? (
          <Image source={{ uri: imageToShow }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Profile Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Add Photo Modal */}
      <Modal
        transparent
        visible={addPhotoModalVisible}
        animationType="fade"
        onRequestClose={() => setAddPhotoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleSelectImage}>
              <Text style={styles.modalOption}>Add Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAddPhotoModalVisible(false)}>
              <Text style={[styles.modalOption, { color: '#666' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Viewer */}
      <Modal
        visible={fullImageVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFullImageVisible(false)}
      >
        <TouchableOpacity
          style={styles.fullImageContainer}
          onPress={() => setFullImageVisible(false)}
        >
          <Image source={{ uri: imageToShow }} style={styles.fullImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>

      {/* User Info */}
      <Text style={styles.name}>{userData.name} {userData.surname}</Text>
      <Text style={styles.info}>Email: {userData.email}</Text>
      <Text style={styles.info}>Phone: {userData.phoneNumber}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('FriendList', { userId })}>
        <Text style={styles.friends}>
          Friends: {userData.friends ? userData.friends.length : 0}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { userId, userData })}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Events */}
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

      <Text style={styles.sectionTitle}>Created Events</Text>
      <FlatList
        data={createdEvents}
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
    marginVertical: 20,
  },
  placeholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  name: { fontSize: 22, fontWeight: 'bold' },
  info: { fontSize: 16, marginVertical: 2 },
  friends: {
    fontSize: 16,
    color: 'blue',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  eventItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  eventName: { fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 40,
    borderRadius: 10,
    padding: 20,
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
