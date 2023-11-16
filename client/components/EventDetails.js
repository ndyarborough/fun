import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import eventApi from '../api/eventApi';
import userApi from '../api/userApi';
import BlockingModal from './BlockingModal';

const EventDetails = ({ route, navigation, userInfo }) => {
  const { eventId, userId } = route.params;
  const [event, setEventData] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useInfo, setUserInfo] = useState(true);
  const [blockedUser, setBlockedUser] = useState(null);
  const [blockingModalVisible, setBlockingModalVisible] = useState(false);
  const [blockingInProgress, setBlockingInProgress] = useState(false);

  useEffect(() => {
    console.log(userInfo)
    setUserInfo(userInfo)
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventResponse = await eventApi.getEvent(eventId);
        console.log(eventResponse.rsvps)
        setEventData(eventResponse);
        setRsvps(eventResponse.rsvps)
        // // Fetch RSVPs for the event
        // const rsvpResponse = await eventApi.getRsvpList();
        setRsvps(eventResponse.rsvps)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleBlockUser = (user) => {
    // Set the user to be blocked in the state
    setBlockedUser(user);
    // Show the blocking confirmation modal
    setBlockingModalVisible(true);
  };

  const handleBlockConfirmation = async () => {
    if (blockingInProgress) {
      return; // Do nothing if the blocking action is already in progress
    }
  
    try {
      setBlockingInProgress(true);
  
      console.log(`Loggedin user: ${userInfo.username} is attempting to Block user: ${blockedUser.username}`);
      const blocked = await userApi.handleBlockConfirmation(userInfo._id, blockedUser._id);
      console.log(blocked);
  
      // Close the blocking confirmation modal
      setBlockingModalVisible(false);
    } catch (error) {
      console.error('Error blocking user:', error);
      // Handle error, show user-friendly message, etc.
    } finally {
      setBlockingInProgress(false);
    }
  };


  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading event data...</Text>
      ) : (
        <View style={styles.container}>
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
            <Text style={styles.value}>{event.recurring ? "Yes" : "No"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>RSVPs:</Text>
            <FlatList
              data={rsvps}
              keyExtractor={(item) => `${item.userId}-${item.email}`}
              renderItem={({ item }) => {
                return (
                  <View style={styles.rsvpRow}>
                    <Text style={styles.rsvpName}>{item.username}</Text>
                    <View style={styles.rsvpIcons}>
                      {/* Icon for messaging */}
                      <TouchableOpacity onPress={() => {
                        console.log(`Sending message to ${item.username}, id: ${item._id}`);
                        navigation.navigate('Message', { username: item.username, userId: item._id });
                      }}>
                        <Image source={require('../assets/message.png')} style={styles.icon} />
                      </TouchableOpacity>

                      {/* Icon for adding as a friend */}
                      <TouchableOpacity onPress={() => console.log('adding friend')}>
                        <Image source={require('../assets/addFriend.png')} style={styles.icon} />
                      </TouchableOpacity>

                      {/* Icon for blocking a user */}
                      <TouchableOpacity onPress={() => handleBlockUser(item)}>
                        <Image source={require('../assets/blockUser.png')} style={styles.icon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>

        </View>
      )}
     {/* Render BlockingModal */}
     {blockingModalVisible && (
        <BlockingModal
          blockingModalVisible={blockingModalVisible}
          setBlockingModalVisible={setBlockingModalVisible}
          blockedUser={blockedUser}
          handleBlockConfirmation={handleBlockConfirmation}
        />
      )}
    </View>
  );
};

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
    flexDirection: 'column',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  rsvpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1, // Add border
    borderColor: '#ddd', // Border color
    padding: 10, // Add padding
    borderRadius: 8, // Add border radius for rounded corners
  },
  rsvpName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rsvpIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
  },
});



export default EventDetails;