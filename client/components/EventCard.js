import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { localDate, localTime } from '../utils/formatFunctions';
import { useNavigation } from '@react-navigation/native';
import eventApi from '../api/eventApi';
import { useAppContext } from './AppContext';
import Toast from 'react-native-root-toast';
import EventPictures from './EventPictures';
import Modal from 'react-native-modal';
import heartIcon from '../assets/heart.webp'
import checkIcon from '../assets/check.png'
import plusIcon from '../assets/plus.png';
import EventActionButton from './EventActionButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DisplayTags from './DisplayTags';

const EventCard = ({ event }) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const {
    myRsvps,
    myEvents,
    setMyEvents,
    user,
    setMyRsvps,
    myInterested,
    setMyInterested,
    setBrowseEvents,
  } = useAppContext();
  const navigation = useNavigation();

  const handleViewDetails = () => {
    navigation.navigate('Event Details', { event });
  };

  const showToast = (message, backgroundColor) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: -80,
      shadow: true,
      backgroundColor,
      animation: true,
    });
  };

  const handleRSVP = async () => {
    try {
      const rsvpAttempt = await eventApi.rsvp(event._id, user._id);

      if (rsvpAttempt === 'RSVP') {
        showToast(`You are now attending ${event.eventName}!`, 'green');
        // Remove the event from myInterested
        const updatedInterested = myInterested.filter(interestedEvent => interestedEvent._id !== event._id);
        setMyInterested(updatedInterested);
        setMyRsvps([...myRsvps, event]);
      } else {
        showToast(`No longer attending ${event.eventName}!`, 'orangered');
        setMyRsvps(myRsvps.filter((rsvp) => rsvp._id !== event._id));
      }
      return rsvpAttempt;
    } catch (err) {
      showToast(`${event.eventName} no longer exists!`, 'red');
    }
  };

  const handleInterested = async () => {
    const interestedAttempt = await eventApi.setInterested(event._id, user._id);
    if (interestedAttempt.message == 'Deleted') {
      setMyInterested(myInterested.filter((item) => item._id !== event._id));
      showToast(`No longer intersted in ${event.eventName}!`, 'orangered');
    }
    else {
      setMyInterested([...myInterested, event]);
      showToast(`You are now interested in ${event.eventName}!`, 'green');

    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalVisible(false);
    try {
      const attemptDelete = await eventApi.delete(event._id, user._id);

      if (attemptDelete.message === 'Deleted') {
        setMyEvents(myEvents.filter((myEvent) => myEvent._id !== event._id));
        setBrowseEvents((prevEvents) =>
          prevEvents.filter((prevEvent) => prevEvent._id !== event._id)
        );
        showToast(`${event.eventName} successfully deleted!`, 'red');
      }
      return attemptDelete;
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast(`${event.eventName} no longer exists`, 'red');
    }
    await handleDelete;
  };

  const handleEventCancel = async () => {
    try {
      const cancelAttempt = await eventApi.cancel(event._id);
      if (cancelAttempt.message === 'cancelled') {
        // Update the status to 'cancelled' in myEvents
        setMyEvents((prevMyEvents) =>
          prevMyEvents.map((myEvent) =>
            myEvent._id === event._id ? { ...myEvent, status: 'cancelled' } : myEvent
          )
        );
        showToast(`Cancelled: ${event.eventName}`)
      } else {
        showToast(`Unsuccessful Cancellation`)
      }
    } catch (error) {
      console.error('Error cancelling event:', error);
    }
  };


  const handleReactivate = async () => {
    try {
      const reactivateAttempt = await eventApi.reactivate(event._id);
      if (reactivateAttempt.message === 'active') {
        // Update the status to 'cancelled' in myEvents
        setMyEvents((prevMyEvents) =>
          prevMyEvents.map((myEvent) =>
            myEvent._id === event._id ? { ...myEvent, status: 'active' } : myEvent
          )
        );
        showToast(`Reactivated: ${event.eventName}`)
      } else {
        showToast(`Unsuccessful reactivation`)

      }
    } catch (error) {
      console.error('Error reactivating event:', error);
    }
  }

  const handleEditPress = () => {
    navigation.navigate('Edit Event', { event })
  }

  const renderDeleteButton = () => {
    if (user._id === event.host._id) {
      // If the user is the host
      if (event.status === 'cancelled') {
        // Display "Reactivate Event" button with the status "Cancelled"
        return (
          <EventActionButton
            onPress={handleReactivate}
            icon={require('../assets/reactivate.png')}
            text={`Repost`}
          />
        );
      } else if (event.rsvps.length > 0 || event.interested.length > 0) {
        // Display "Cancel Event" button with a different icon
        return (
          <>
            <EventActionButton
              onPress={handleEventCancel}
              icon={require('../assets/cancel.png')}
              text={event.status === 'active' ? 'Cancel' : 'Reactivate'}
            />
          </>
        );
      } else {
        // Display "Delete Event" button with the default icon
        return (
          <EventActionButton
            onPress={handleDelete}
            icon={require('../assets/delete.webp')}
            text={``}
          />
        );
      }
    }
    return null; // No button to display if the user is not the host
  };

  const renderHostInfo = () => {
    return (
      <View style={styles.hostContainer}>
        <Pressable onPress={handleProfilePress}>
          <Image source={{ uri: event.host.profilePic }} style={styles.hostProfilePic} />
        </Pressable>
        <Pressable onPress={handleProfilePress}>
          <Text style={styles.hostUsername}>{event.host.username}</Text>
        </Pressable>
      </View>
    );
  };
  const renderTags = () => {
    if (event.tags && event.tags.length > 0) {
      return <DisplayTags tags={event.tags} />;
    }
    return null;
  };

  const handleProfilePress = () => {
    if (user._id === event.host._id) {
      navigation.navigate('Dashboard')
    } else {
      navigation.navigate('View Profile', { randomUser: event.host._id })
    }
  }

  return (
    <View style={styles.card}>

      <View style={styles.row}>
        {renderHostInfo()}
        <EventActionButton onPress={handleViewDetails} icon={require('../assets/viewDetails.png')} text="Details" />
        {renderDeleteButton()}
      </View>
      {event.pictures && event.pictures.length > 0 && (
        <View style={styles.imageContainer}>
          <EventPictures pictures={event.pictures} />
        </View>
      )}

      <Text style={styles.tags}>{renderTags()}</Text>

      <View style={styles.row}>
        <Text style={styles.title}>{event.eventName}</Text>
      </View>

      <Modal isVisible={isDeleteModalVisible} onBackdropPress={() => setDeleteModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text>Are you sure you want to delete {event.eventName}?</Text>
          <View style={styles.modalButtons}>
            <Pressable onPress={handleConfirmDelete}>
              <Text>Yes</Text>
            </Pressable>
            <Pressable onPress={() => setDeleteModalVisible(false)}>
              <Text>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Text>{event.description}</Text>
      <Text style={styles.tags}>{localDate(event.date)} @ {localTime(event.startTime)} - {localTime(event.endTime)}</Text>
      {event.host._id === user._id && (
        <Pressable
          style={styles.editIconContainer}
          onPress={handleEditPress}
        >
          <Text>Edit</Text>
          <Image
            source={require('../assets/edit.png')}
            style={styles.editIcon}
          />
        </Pressable>
      )}
      {user._id !== event.host._id && (
        <View style={styles.actionRow}>
          <EventActionButton
            onPress={() => handleRSVP(event._id)}
            icon={myRsvps.some(rsvp => rsvp._id === event._id) ? checkIcon : require('../assets/rsvp.png')}
            text={myRsvps.some(rsvp => rsvp._id === event._id) ? 'Attending' : ''}
          />

          {!myRsvps.some(rsvp => rsvp._id === event._id) && (
            <EventActionButton
              onPress={handleInterested}
              icon={myInterested.some(interested => interested._id === event._id) ? heartIcon : plusIcon}
              text="Interested"
            />
          )}
        </View>
      )}
    </View>
  );
};

// Styles are imported from either browseScreen or profileScreen
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 15,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tags: {
    marginTop: 12
  },
  editIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    alignItems: 'center'
  },
  editIcon: {
    height: 25,
    width: 25,
    marginLeft: 8
  },
  swiper: {
    height: hp('100%'),
  },
  image: {
    height: '100%',
    width: wp('100%'),
    borderRadius: 15,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hostProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 155,
    marginRight: 8,
  },
  hostUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  }
});

export default EventCard;