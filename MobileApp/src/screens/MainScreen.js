// frontend/src/screens/MainScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MainScreen({ route }) {
  // We passed 'user' in the params from the LoginScreen
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome {user?.username || 'Guest'}!
      </Text>
      <Text>Name: {user?.name}</Text>
      <Text>Surname: {user?.surname}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Phone: {user?.phoneNumber}</Text>
      <Text>Interests: {user?.interests}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20
  }
});
