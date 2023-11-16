import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyEvents from './MyEvents';
import MyRsvps from './MyRsvps';
import userApi from '../api/userApi';

const ViewProfile = ({ route, navigation, updateUser, userInfo }) => {

  // Set State information for MyEvents and MyRsvps components
  const [myEvents, setMyEvents] = useState(null);
  const [myRsvps, setMyRsvps] = useState(null);

  // Get Userinfo
  useEffect(() => { // Use Effects happen when the component mounts
    const fetchUserInfo = async () => {
        const user = await userApi.getUserInfo(userInfo._id);
        console.log(user)
        updateUser(user);
    };
    // Add an event listener for the focus event
    const unsubscribe = navigation.addListener('focus', fetchUserInfo);
    // Clean up the event listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  // Get User Events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (userInfo) {
          const eventsData = await userApi.getMyEvents(userInfo._id);
          setMyEvents(eventsData);
        }
      } catch (error) {
        console.error('Error fetching user data or events:', error);
      }
    };
    fetchUserEvents();
  }, [userInfo]);

  // GetUserRsvps on Mount
  useEffect(() => {
    const fetchUserRsvps = async () => {
      try {
        if (userInfo) {
          const rsvpsData = await userApi.getMyRsvps(userInfo._id);
          setMyRsvps(rsvpsData);
        }
      } catch (error) {
        console.error('Error fetching user data or RSVPs:', error);
      }
    };
    fetchUserRsvps();
  }, [userInfo]);


  // Event Handler Functions

  const handleEditProfile = () => {
    console.log('Clicked me!');
    navigation.navigate('EditProfile')
    // Add logic for navigating to the edit profile screen or any other action
  };

  const handleDeleteEvent = (eventId) => {
    // Remove the deleted event from the local state
    setMyEvents((prevEvents) => prevEvents.filter((e) => e._id !== eventId));
  };

  const handleMessagesPress = () => {
    // Navigate to the 'Messages' screen
    navigation.navigate('Messages');
  };

  const deleteUserSession = () => {
    AsyncStorage.removeItem('@user').then(() => {
      navigation.navigate('SignIn');
    });
    setMyEvents(null);
    setMyRsvps(null)
  };

  const handlePreferences = () => {

    navigation.navigate('Preferences');


  };

  // HTML for ViewProfile component
  return (
    <View style={styles.container}>
      {!userInfo ? (
        <Text>No user info</Text>
      ) : (
        <View style={styles.profile}>
          <Pressable onPress={handleEditProfile} style={styles.editProfileContainer}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
            <Image source={require('../assets/editing.png')} style={styles.editProfileIcon} />
          </Pressable>
          <Pressable style={styles.button} onPress={() => deleteUserSession()}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => handlePreferences()}>
            <Text style={styles.buttonText}>Preferences</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => navigation.navigate('InboxScreen')}>
            <Text style={styles.buttonText}>Inbox</Text>
          </Pressable>

          {/* Pressable to navigate to 'Messages' screen */}
          {/* <Pressable style={styles.button} onPress={handleMessagesPress}>
            <Text style={styles.buttonText}>Messages</Text>
          </Pressable> */}

          <Text>Username: {userInfo.username}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Text>Full Name: {userInfo.fullName}</Text>

          {/* Pass myEvents from ViewProfile state as a prop to MyEvents */}
          <MyEvents
            navigation={navigation}
            myEvents={myEvents}
            userId={userInfo._id}
            onDeleteEvent={handleDeleteEvent} // Pass the function to MyEvents
          />

          {/* Pass myRsvps from ViewProfile state as a prop to MyRsvps */}
          <MyRsvps
            navigation={navigation}
            myRsvps={myRsvps}
            userId={userInfo._id}
            setRsvps={setMyRsvps}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    padding: 20,
    minWidth: '90%'
  },
  editProfileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    marginRight: 16, // Adjust the right margin for spacing
  },
  editProfileText: {
    marginRight: 8,
    // Add any styles for the text
  },
  editProfileIcon: {
    width: 20, // Adjust width and height based on your image size
    height: 20,
    // Add any other styles for the image
  },
  profile: {
    minWidth: '100%'
  },
  button: {
    border: 'solid black 1px',
    marginBottom: '2vh',
    borderRadius: 8,
    maxWidth: '12vh',
    alignItems: 'center'
  },
});

export default ViewProfile;