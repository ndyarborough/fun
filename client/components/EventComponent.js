// EventComponent.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import eventApi from '../api/eventApi';
import userApi from '../api/userApi';

const EventComponent = ({ event, handleRSVP, handleViewDetails, handleReportPost, userInfo }) => {
  const eventId = event._id;
  const [eventHost, setEventHost] = useState(null);

  useEffect(() => {
    eventApi.getEvent(eventId).then((eventData) => {
      userApi.getUserInfo(event.host).then((user) => {
        setEventHost(user.fullName);
      });
    });
  }, [eventId]);

  return (
    <RectButton
      onPress={() => handleViewDetails(event._id)}
      style={styles.container}
    >
      <View style={styles.leftContainer}>
        <Text>{event.eventName}</Text>
        <Text>Date: {new Date(event.date).toLocaleDateString()}</Text>
        <Text>Address: {event.address}</Text>
        <Text>Capacity: {event.capacity}</Text>
        <Text>Host: {eventHost}</Text>
      </View>

      <View style={styles.rightContainer}>
        <Pressable style={styles.button} onPress={() => handleRSVP(eventId, userInfo._id)}>
          <Text>RSVP</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleReportPost(eventId, event.eventName)}>
          <Text>Report Post</Text>
        </Pressable>
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'black',
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#fff',
    },
    leftContainer: {
      width: '60%',
      alignItems: 'center',
    },
    rightContainer: {
      width: '40%',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    button: {
      padding: 5,
      marginVertical: 5,
      backgroundColor: '#DDDDDD',
      borderRadius: 5,
    },
  });
  
  export default EventComponent;
  