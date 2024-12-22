import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Button, Modal, Text, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function ActivityItem(props) {
  return (
    <View style={styles.activityItem}>
      <Pressable
        android_ripple={{ color: '#210644' }}
        onPress={() => props.onSelectActivity(props.id)}
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        <Text style={styles.activityText}>{props.title}</Text>
      </Pressable>
    </View>
  );
}

function PoolOfPeopleModal(props) {
  const people = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Michael Brown' },
  ];

  return (
    <Modal visible={props.visible} animationType="slide" onRequestClose={props.onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Pool of People</Text>
        <FlatList
          data={people}
          renderItem={(itemData) => (
            <View style={styles.personItem}>
              <Text style={styles.personText}>{itemData.item.name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <Button title="Close" onPress={props.onClose} color="#f31282" />
      </View>
    </Modal>
  );
}

function ActivityDetailsModal(props) {
  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{props.activity?.title}</Text>
        <Text style={styles.modalDetails}>Date: {props.activity?.date}</Text>
        <Text style={styles.modalDetails}>Location: {props.activity?.location}</Text>
        <Text style={styles.modalDetails}>Opportunity: {props.activity?.opportunity}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Meet People" onPress={props.onMeetPeople} color="#4caf50" />
          <Button title="Plan to Attend" onPress={props.onPlanEvent} color="#2196f3" />
          <Button title="Close" onPress={props.onClose} color="#f31282" />
        </View>
      </View>
    </Modal>
  );
}

export default function MainPage({ navigation }) {
  const [activities] = useState([
    {
      id: '1',
      title: 'Hiking',
      date: '2024-12-25',
      location: 'Mountain Trail',
      opportunity: '10% off gear rental',
    },
    {
      id: '2',
      title: 'Cycling',
      date: '2024-12-28',
      location: 'City Park',
      opportunity: 'Free helmet rental',
    },
    {
      id: '3',
      title: 'Cooking Class',
      date: '2024-12-30',
      location: 'Downtown Kitchen',
      opportunity: 'Bring a friend for free',
    },
    {
      id: '4',
      title: 'Painting Workshop',
      date: '2025-01-05',
      location: 'Art Studio',
      opportunity: 'Materials included',
    },
  ]);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [peopleModalVisible, setPeopleModalVisible] = useState(false);

  function selectActivityHandler(activityId) {
    const activity = activities.find((item) => item.id === activityId);
    setSelectedActivity(activity);
    setModalVisible(true);
  }

  function closeActivityModalHandler() {
    setModalVisible(false);
    setSelectedActivity(null);
  }

  function showPeopleModalHandler() {
    setPeopleModalVisible(true);
  }

  function closePeopleModalHandler() {
    setPeopleModalVisible(false);
  }

  function goToProfileHandler() {
    navigation.navigate('Profile');
  }

  function planToEventHandler() {
    Alert.alert(
      'Good Choice!',
      'We have notified the relevant authorities that you are coming ;)',
      [{ text: 'OK', style: 'default' }]
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.appContainer}>
        <Text style={styles.header}>Activity Finder</Text>
        <View style={styles.activitiesContainer}>
          <FlatList
            data={activities}
            renderItem={(itemData) => (
              <ActivityItem
                title={itemData.item.title}
                id={itemData.item.id}
                onSelectActivity={selectActivityHandler}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <ActivityDetailsModal
          visible={modalVisible}
          activity={selectedActivity}
          onClose={closeActivityModalHandler}
          onMeetPeople={showPeopleModalHandler}
          onPlanEvent={planToEventHandler}
        />
        <PoolOfPeopleModal visible={peopleModalVisible} onClose={closePeopleModalHandler} />
        <View style={styles.separator} />
        <View style={styles.profileButtonContainer}>
          <Button title="Go to Profile" onPress={goToProfileHandler} color="#4caf50" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  activitiesContainer: {
    flex: 1,
    marginTop: 10,
  },
  activityItem: {
    margin: 8,
    borderRadius: 6,
    backgroundColor: '#5e08cc',
  },
  pressedItem: {
    opacity: 0.5,
  },
  activityText: {
    color: 'white',
    padding: 8,
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  profileButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4caf50',
  },
  personItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#2196f3',
    borderRadius: 6,
  },
  personText: {
    color: '#fff',
    fontSize: 16,
  },
});
