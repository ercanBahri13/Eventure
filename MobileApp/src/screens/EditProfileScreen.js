import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfileScreen({ route, navigation }) {
  const { userId, userData } = route.params || {};

  const [name, setName] = useState(userData?.name || '');
  const [surname, setSurname] = useState(userData?.surname || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullImageVisible, setFullImageVisible] = useState(false);

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedImage(asset);
        setModalVisible(false);
      }
    });
  };

  const uploadImageToServer = async () => {
    if (!selectedImage) return profileImage;

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage.uri,
      name: selectedImage.fileName || 'profile.jpg',
      type: selectedImage.type || 'image/jpeg',
    });

    const res = await fetch(`http://10.0.2.2:8080/users/${userId}/upload-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });

    const imageUrl = await res.text();
    return imageUrl;
  };

  const handleSaveChanges = async () => {
    try {
      const uploadedImageUrl = await uploadImageToServer();

      const response = await fetch(`http://10.0.2.2:8080/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          surname,
          email,
          phoneNumber,
          profileImage: uploadedImageUrl,
        }),
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

  const imageToShow = selectedImage?.uri || (profileImage ? profileImage : null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Profile Image Section */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {imageToShow ? (
          <Image source={{ uri: imageToShow }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]}>
            <Text style={styles.placeholderText}>Select Profile Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal for Image Options */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {imageToShow ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setFullImageVisible(true);
                  }}
                >
                  <Text style={styles.modalOption}>View Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSelectImage}>
                  <Text style={styles.modalOption}>Change Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedImage(null);
                    setProfileImage('');
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalOption, { color: 'red' }]}>Delete Photo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleSelectImage}>
                <Text style={styles.modalOption}>Add Photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setModalVisible(false)}>
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

      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Surname" value={surname} onChangeText={setSurname} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Button title="Save" onPress={handleSaveChanges} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 5
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 16
  },
  placeholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 40,
    borderRadius: 10,
    padding: 20
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: 'center'
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  fullImage: {
    width: '100%',
    height: '100%'
  }
});
