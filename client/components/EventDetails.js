import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import eventApi from '../api/eventApi';
import userApi from '../api/userApi';
import BlockingModal from './BlockingModal';
import Toast from 'react-native-toast-message';

const EventDetails = ({ route, navigation, userInfo }) => {
  const { eventId, userId } = route.params;
  const [event, setEventData] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockedUser, setBlockedUser] = useState(null);
  const [blockingModalVisible, setBlockingModalVisible] = useState(false);
  const [blockingInProgress, setBlockingInProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await eventApi.getEvent(eventId);
        setEventData(eventResponse);
        setRsvps(eventResponse.rsvps);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleBlockUser = (user) => {
    setBlockedUser(user);
    setBlockingModalVisible(true);
  };


  const handleBlockConfirmation = async () => {
    if (blockingInProgress) {
      return;
    }

    try {
      setBlockingInProgress(true);
      const blocked = await userApi.handleBlockConfirmation(userInfo._id, blockedUser._id);

      Toast.show({
        type: 'success',
        text1: 'User blocked successfully',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });

      setBlockingModalVisible(false);
    } catch (error) {
      console.error('Error blocking user:', error);

      Toast.show({
        type: 'error',
        text1: 'User already blocked',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });
    } finally {
      setBlockingInProgress(false);
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text>Loading event data...</Text>
      ) : (
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>{event.eventName}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{new Date(event.date).toLocaleDateString()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Start Time:</Text>
            <Text style={styles.value}>{formatTime(event.startTime)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>End Time:</Text>
            <Text style={styles.value}>{formatTime(event.endTime)}</Text>
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
            <View style={styles.rsvpRow}>
              <Text style={styles.rsvpName}>{event.host.username}</Text>
              {userInfo._id !== event.host._id && (
                <View style={styles.rsvpIcons}>
                  <TouchableOpacity onPress={() => console.log(`Sending message to ${event.host.username}`)}>
                    <Image source={require('../assets/message.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => console.log('adding host as a friend')}>
                    <Image source={require('../assets/addFriend.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleBlockUser(event.host)}>
                    <Image source={require('../assets/blockUser.png')} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Recurring:</Text>
            <Text style={styles.value}>{event.recurring ? 'Yes' : 'No'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>RSVPs:</Text>
            <FlatList
              data={rsvps}
              keyExtractor={(item) => `${item.userId}-${item.email}`}
              renderItem={({ item }) => (
                <View style={styles.rsvpRow}>
                  <Text style={styles.rsvpName}>{item.username}</Text>
                  <View style={styles.rsvpIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Message', { receiverId: item._id })}>
                      <Image source={require('../assets/message.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('adding friend')}>
                      <Image source={require('../assets/addFriend.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleBlockUser(item)}>
                      <Image source={require('../assets/blockUser.png')} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      )}
      {blockingModalVisible && (
        <BlockingModal
          blockingModalVisible={blockingModalVisible}
          setBlockingModalVisible={setBlockingModalVisible}
          blockedUser={blockedUser}
          handleBlockConfirmation={handleBlockConfirmation}
        />
      )}
    </ScrollView>
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
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
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


