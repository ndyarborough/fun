import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import EventCard from './EventCard';
import { useAppContext } from './AppContext';
import eventApi from '../api/eventApi';
import PlusIcon from '../assets/plus.png';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomSearchBar from './CustomSearchBar';
import Filters from './Filters';

const BrowseScreen = () => {
  const navigation = useNavigation();

  const {
    user,
    browseEvents,
    setBrowseEvents,
  } = useAppContext();

  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventData = await eventApi.getEvents();
        const filteredEvents = eventData.filter(event => event.status !== 'cancelled');

        const searchedEvents = filteredEvents.filter(event =>
          event.eventName.toLowerCase().includes(search.toLowerCase()) ||
          event.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );

        setBrowseEvents(searchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [search, setBrowseEvents]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.filterContainer}>
          <CustomSearchBar search={search} updateSearch={setSearch} />
          <Filters />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            navigation.navigate('Create Event');
          }}
        >
          <Text style={styles.buttonText}>Create Event</Text>
          <Image source={PlusIcon} style={styles.plusIcon} />
        </TouchableOpacity>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadMessage}>Loading Events Near You</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <CustomSearchBar search={search} updateSearch={setSearch} />
        {/* <Filters /> */}
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.navigate('Create Event');
        }}
      >
        <Text style={styles.buttonText}>Create Event</Text>
        <Image source={PlusIcon} style={styles.plusIcon} />
      </TouchableOpacity>

      <ScrollView style={styles.scroll}>
        {browseEvents ? (
          browseEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <Text>Issue Retrieving Events from the database</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('10%'),
    backgroundColor: '#fffffe',
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
  scroll: {
    width: wp('95%'),
    maxWidth: 1000,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 8,
    backgroundColor: 'orange',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  plusIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  filterContainer: {
    width: wp('100%'), // Ensure the filter container takes the entire width
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingIndicator: {
    marginTop: 16, // Adjust the marginTop as needed
  },
});

export default BrowseScreen;
