import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';





export default function ProfilePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style = {styles.profileImage}
      />
      <Text style={styles.name}>Alper Bozkurt</Text>
      <Text style={styles.surname}>Software Engineer</Text>
      <Button title="Go to Main Page" onPress={() => navigation.navigate('MainPage')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  surname: {
    fontSize: 18,
    marginBottom: 20,
  },
});
