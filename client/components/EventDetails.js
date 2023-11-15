import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNavBar from './BottomNavbar';
import eventApi from '../api/eventApi';
import userApi from '../api/userApi';

const EventDetails = ({ route, navigation }) => {
  const { eventId, userId } = route.params;
  const [event, setEventData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    eventApi.getEvent(eventId)
      .then(async (event) => {
        const user = await userApi.getUserInfo(event.host);
        setUserInfo(user);
  
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);
  
        // Check if startTime and endTime are valid date objects
        if (!isNaN(startTime) && !isNaN(endTime)) {
          const localStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const localEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
          console.log(localStartTime);
          console.log(localEndTime);
  
          const formattedEvent = {
            eventName: event.eventName,
            date: event.date,
            startTime: localStartTime,
            endTime: localEndTime,
            duration: event.duration,
            address: event.address,
            capacity: event.capacity,
            description: event.description,
            host: user.fullName,
            recurring: event.recurring,
          };
  
          setEventData(formattedEvent);
          setLoading(false);
        } else {
          console.error('Invalid startTime or endTime format');
          // Handle the error or set default values if needed
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);
  
  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading event data...</Text>
      ) : (
        <View style={styles.container}>

          <Text>Events</Text>
          <Text style={styles.headerText}>{event.eventName}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{new Date(event.date).toLocaleDateString()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Start Time:</Text>
            <Text style={styles.value}>{event.startTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>End Time:</Text>
            <Text style={styles.value}>{event.endTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{event.address}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Capacity:</Text>
            <Text style={styles.value}>{event.capacity} people</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{event.description}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Host:</Text>
            <Text style={styles.value}>{event.host}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Recurring:</Text>
            <Text style={styles.value}>{event.reacurring ? "Yes" : "No"}</Text>
          </View>
        </View>

      )} </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
});

export default EventDetails;