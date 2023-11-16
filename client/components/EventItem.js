import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
// import eventApi from '../api/eventApi';
// import userApi from '../api/userApi';

const EventItem = ({ event, handleRSVP, handleViewDetails, handleReportPost, userInfo }) => {
  // Log the event at the beginning
  const eventId = event._id
  console.log(event.host)
  const [eventHost, setEventHost] = useState(null)

  // useEffect(() => {
  //   eventApi.getEvent(eventId).then((eventData) => {
  //     userApi.getUserInfo(event.host).then(user => {
  //       console.log(eventData)
  //       setEventHost(user.fullName)
  //     })
  //     console.log(eventData);
  //     setEvent(eventData);
  //   });
  // }, [eventId]);

  return (
    <View style={styles.container}>
      {/* Left side (80%) */}
      <View style={styles.leftContainer}>
        <Text>{event.eventName}</Text>
        <Text>Date: {new Date(event.date).toLocaleDateString()}</Text>
        <Text>Address: {event.address}</Text>
        <Text>Capacity: {event.capacity}</Text>
        <Text>Host: {event.host.username}</Text>
      </View>

      {/* Right side (20%) */}
      <View style={styles.rightContainer}>
        <Pressable style={styles.button} onPress={() => handleRSVP(eventId, userInfo._id)}>
          <Text>RSVP</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleViewDetails(event._id)}>
          <Text>View Details</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleReportPost(event._id, event.eventName)}>
          <Text>Report Post</Text>
        </Pressable>
      </View>
    </View>
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
  },
  leftContainer: {
    width: '60%',
    alignItems: 'center', // Center the content in the left container
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
  },
});

export default EventItem;
