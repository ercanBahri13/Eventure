// frontend/src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // If login successful:
        const userData = await response.json();
        // Navigate to Main, pass the user as a param
        navigation.navigate('Home', { user: userData });
      } else {
        const errorMsg = await response.text();
        Alert.alert('Login Failed', errorMsg);
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Submit" onPress={handleLogin} />

        {/* Forgot Password Button */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: {
      borderWidth: 1, borderColor: '#ccc',
      marginVertical: 10, padding: 10, borderRadius: 5
    },
    forgot: {
      marginTop: 15,
      color: 'blue',
      textAlign: 'center',
    },
  });
