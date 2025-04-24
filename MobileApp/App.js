// frontend/App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FriendListScreen from './src/screens/FriendListScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SearchFriendsScreen from './src/screens/SearchFriendsScreen';
import PublicProfileScreen from './src/screens/PublicProfileScreen';
import MapScreen from './src/screens/MapScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerBackVisible: false }} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="FriendList" component={FriendListScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="SearchFriends" component={SearchFriendsScreen} />
        <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
        <Stack.Screen name="MapScreen" component = {MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
