// ViewProfile.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, ActivityIndicator } from 'react-native';
import ProfileBanner from './ProfileBanner';
import EventList from './EventList';
import userApi from '../api/userApi';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ViewProfile = ({ route }) => {
  const { randomUser } = route.params; // Extract randomUser from the route
  const [selectedSection, setSelectedSection] = useState('hosting');
  const [user, setUser] = useState({});
  const [userEvents, setUserEvents] = useState([]);
  const [userRsvps, setUserRsvps] = useState([]);
  const [userInterested, setUserInterested] = useState([]);

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(true);
  const [isLoadingInterested, setIsLoadingInterested] = useState(true);


  const fetchData = async () => {
    try {
      const userData = await userApi.getUserInfo(randomUser);
      setUser(userData);
      const eventsData = await userApi.getMyEvents(randomUser);
      setUserEvents(eventsData || []);
      setIsLoadingEvents(false);
      const rsvpData = await userApi.getMyRsvps(randomUser);
      setUserRsvps(rsvpData || []);
      setIsLoadingRsvps(false);

      const interestedData = await userApi.getMyInterested(randomUser);
      setUserInterested(interestedData);
      setIsLoadingInterested(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [randomUser]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  if (isLoadingEvents || isLoadingRsvps || isLoadingInterested) {
    return (
      <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadMessage}>Loading {user.username}'s Profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ProfileBanner user={user} notMe={true} randomUserId={randomUser}/>

      <View style={styles.sectionToggleContainer}>
        <Pressable onPress={() => handleSectionChange('hosting')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'hosting' ? styles.selectedToggleText : styles.toggleText}>Hosting</Text>
        </Pressable>

        <Pressable onPress={() => handleSectionChange('attending')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'attending' ? styles.selectedToggleText : styles.toggleText}>Attending</Text>
        </Pressable>

        <Pressable onPress={() => handleSectionChange('interested')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'interested' ? styles.selectedToggleText : styles.toggleText}>Interested</Text>
        </Pressable>
      </View>

      {/* Display EventList based on the selected section */}
      <View style={styles.eventsContainer}>
        {/* New condition for 'All' tab */}
        {selectedSection === 'hosting' && (
          <EventList
            events={(userEvents || []).filter(event => event.status !== 'cancelled')}
            title="Hosting"
          />
        )}
        {selectedSection === 'attending' && (
          <EventList
            events={(userRsvps || []).filter(event => event.status !== 'cancelled')}
            title="Attending"
          />
        )}
        {selectedSection === 'interested' && (
          <EventList
            events={(userInterested || []).filter(event => event.status !== 'cancelled')}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default ViewProfile;
