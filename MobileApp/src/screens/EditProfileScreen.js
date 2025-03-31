// frontend/src/screens/EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image, TouchableOpacity } from 'react-native';

export default function EditProfileScreen({ route, navigation }) {
  const { userId, userData } = route.params || {};

  // Pre-fill with existing data
  const [name, setName] = useState(userData?.name || '');
  const [surname, setSurname] = useState(userData?.surname || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');

  const [profileLocalUri, setProfileLocalUri] = useState(userData?.profileImage || '');

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        setProfileLocalUri(asset.uri);
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, phoneNumber, profileImage }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Profile updated!');
        navigation.goBack();
      } else {
        const errorMsg = await response.text();
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
  const handleImagePress = () => {
    launchImageLibrary({mediaType: 'photo'}, (res) => {
      if (!res.didCancel && !res.errorMessage && res.assets) {
        const asset = res.assets[0];
        setProfileLocalUri(asset.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Image URL"
        value={profileImage}
        onChangeText={setProfileImage}
      />

      <Button title="Save" onPress={handleSaveChanges} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 8, marginVertical: 8, borderRadius: 5
  }
});
