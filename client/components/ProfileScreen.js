// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, ActivityIndicator } from 'react-native';
import ProfileBanner from './ProfileBanner';
import EventList from './EventList';
import { useAppContext } from './AppContext';
import userApi from '../api/userApi';
import { useFocusEffect } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ProfileScreen = () => {
  const {
    user,
    setLoggedIn,
    myEvents,
    setMyEvents,
    myRsvps,
    setMyRsvps,
    myInterested,
    setMyInterested,
  } = useAppContext();

  const [selectedSection, setSelectedSection] = useState('all');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(true);
  const [isLoadingInterested, setIsLoadingInterested] = useState(true);

  const fetchData = async () => {
    try {
      const eventsData = await userApi.getMyEvents(user._id);
      setMyEvents(eventsData || []);
      setIsLoadingEvents(false);

      const rsvpData = await userApi.getMyRsvps(user._id);
      setMyRsvps(rsvpData || []);
      setIsLoadingRsvps(false);

      const interestedData = await userApi.getMyInterested(user._id);
      setMyInterested(interestedData || []);
      setIsLoadingInterested(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoadingEvents(false);
      setIsLoadingRsvps(false);
      setIsLoadingInterested(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user._id, setMyEvents, setMyRsvps]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [user._id])
  );

  if (isLoadingEvents || isLoadingRsvps || isLoadingInterested) {
    return (
      <View style={styles.loadingContainer}>
        <ProfileBanner user={user} setLoggedIn={setLoggedIn} />
        <View style={styles.loadingContent}>
          <View style={styles.sectionToggleContainer}>
            <Pressable onPress={() => setSelectedSection('all')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Text style={selectedSection === 'all' ? styles.selectedToggleText : styles.toggleText}>All</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSection('hosting')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Text style={selectedSection === 'hosting' ? styles.selectedToggleText : styles.toggleText}>Hosting</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSection('attending')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Text style={selectedSection === 'attending' ? styles.selectedToggleText : styles.toggleText}>Attending</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSection('interested')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Text style={selectedSection === 'interested' ? styles.selectedToggleText : styles.toggleText}>Interested</Text>
            </Pressable>
          </View>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadMessage}>Loading Your Events</Text>
        </View>
      </View>
    );
  }


  return (
    <ScrollView style={styles.container}>
      <ProfileBanner user={user} setLoggedIn={setLoggedIn} />
      <View style={styles.sectionToggleContainer}>
        <Pressable onPress={() => setSelectedSection('all')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'all' ? styles.selectedToggleText : styles.toggleText}>All</Text>
        </Pressable>
        <Pressable onPress={() => setSelectedSection('hosting')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'hosting' ? styles.selectedToggleText : styles.toggleText}>Hosting</Text>
        </Pressable>
        <Pressable onPress={() => setSelectedSection('attending')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'attending' ? styles.selectedToggleText : styles.toggleText}>Attending</Text>
        </Pressable>
        <Pressable onPress={() => setSelectedSection('interested')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'interested' ? styles.selectedToggleText : styles.toggleText}>Interested</Text>
        </Pressable>
      </View>
      <View style={styles.eventsContainer}>
        {selectedSection === 'all' && (
          <EventList
            events={(myEvents || []).concat(myRsvps || [], myInterested || [])}
            title="All"
          />
        )}
        {selectedSection === 'hosting' && (
          <EventList
            events={(myEvents || []).filter(event => event.status !== 'cancelled')}
            title="Hosting"
          />
        )}
        {selectedSection === 'attending' && (
          <EventList
            events={(myRsvps || []).filter(event => event.status !== 'cancelled')}
            title="Attending"
          />
        )}
        {selectedSection === 'interested' && (
          <EventList
            events={(myInterested || []).filter(event => event.status !== 'cancelled')}
            title="Interested"
          />
        )}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: hp('1%'),
    backgroundColor: '#fffffe'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loadingContent: {
    marginTop: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMessage: {
    marginTop: 10
  },
  eventsContainer: {
    width: wp('90%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    paddingBottom: hp('10%')
  },
  sectionToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  toggleText: {
    color: '#000',
    padding: 10,
  },
  selectedToggleText: {
    color: '#00f',
    padding: 10,
  },
});

export default ProfileScreen;