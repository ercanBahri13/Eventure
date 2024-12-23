// frontend/src/screens/ResetPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function ResetPasswordScreen({ navigation }) {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:8080/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Password updated!');
        navigation.navigate('Login');
      } else {
        const err = await response.text();
        Alert.alert('Error', err);
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text>Enter the token from your email and your new password.</Text>
      <TextInput
        style={styles.input}
        placeholder="Reset Token"
        value={resetToken}
        onChangeText={setResetToken}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
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
});
