// frontend/src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [interests, setInterests] = useState('');

  const handleRegister = async () => {
    if (!name || !surname || !email || !username || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
    // Assuming `interestsInput` is a comma-separated string from a TextInput:
    const interestsArray = interests
      .split(',')
      .map(str => str.trim())
      .filter(str => str.length > 0);

    const response = await fetch('http://10.0.2.2:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        surname,
        email,
        username,
        password,
        phoneNumber,
        interests: interestsArray,  // <-- now an actual array
      }),
    });


      if (response.ok) {
        Alert.alert('Success', 'Registration complete. You can now log in.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        const errorMsg = await response.text();
        Alert.alert('Registration Failed', errorMsg);
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Register</Text>
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
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Interests (comma-separated)"
        value={interests}
        onChangeText={setInterests}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5
  }
});
