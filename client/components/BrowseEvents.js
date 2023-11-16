// BrowseEvents.js
import React, { useState, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import EventList from './EventList';
import Filters from './Filters';
import eventApi from '../api/eventApi';

const BrowseEvents = ({ route, navigation, userInfo, setUserInfo }) => {
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('12:00');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetails = (eventId) => {
    navigation.navigate('EventDetails', { eventId, userId: userInfo._id });
  };

  const handleRSVP = (eventId, userId) => {
    eventApi.rsvp(eventId, userId)
      .then(response => {
        setRsvpMessage(response.message);
        setTimeout(() => {
          setRsvpMessage('');
        }, 3000);
      })
      .catch(error => {
        console.error('Error RSVPing to event:', error);
      });
  };

  const handleReportPost = (eventId, eventName) => {
    const reportData = {
      userId: userInfo._id,
      reason: 'Inappropriate content',
    };

    eventApi.reportEvent(eventId, reportData)
      .then(response => {
        console.log('Event reported successfully:', response);
        Toast.show({
          type: 'success',
          text1: `${eventName} reported for inappropriate conduct`,
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
      })
      .catch(error => {
        console.error('Error reporting event:', error);
      });
  };

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleTimeChange = (time, type) => {
    if (type === 'start') {
      setStartTime(time);
    } else {
      setEndTime(time);
    }
  };

  const handleFilterButtonPress = () => {
    const filteredEvents = originalEvents.filter((event) => {
      const eventDate = new Date(event.date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const eventStartTimeParts = event.startTime.split(':');
      const eventStartTime = new Date(eventDate);
      eventStartTime.setHours(parseInt(eventStartTimeParts[0], 10));
      eventStartTime.setMinutes(parseInt(eventStartTimeParts[1], 10));

      const eventEndTimeParts = event.endTime.split(':');
      const eventEndTime = new Date(eventDate);
      eventEndTime.setHours(parseInt(eventEndTimeParts[0], 10));
      eventEndTime.setMinutes(parseInt(eventEndTimeParts[1], 10));

      const isDateInRange = eventDate >= startDate && eventDate <= endDate;
      const isStartTimeInRange = eventStartTime.toLocaleTimeString('en-US', { hour12: false }) >= startTime;
      const isEndTimeInRange = eventEndTime.toLocaleTimeString('en-US', { hour12: false }) <= endTime;
      const isSearchMatch = event.eventName.toLowerCase().includes(searchQuery.toLowerCase());

      console.log(isSearchMatch)

      return isDateInRange && isStartTimeInRange && isEndTimeInRange && isSearchMatch;
    });

    setEvents(filteredEvents);
  };

  useEffect(() => {
     // Set initial values for start date, end date, start time, and end time filters
     const today = new Date();
     const today2 = new Date();
     const sevenDaysAgo = today.setUTCDate(today.getUTCDate() - 7);
     const oneMonthFromToday = new Date(today2);
     oneMonthFromToday.setMonth(oneMonthFromToday.getMonth() + 1);
 
     setStartDate(sevenDaysAgo);
     setEndDate(oneMonthFromToday);
     setStartTime('00:00'); // Set start time to 12:00 AM
     setEndTime('23:59');   // Set end time to 11:59 PM

    setStartDate(today);
    setEndDate(oneMonthFromToday);
    eventApi.getEvents()
      .then(events => {
        console.log(events[0].host.fullName)
        setEvents(events);
        setOriginalEvents(events);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <Pressable style={{ marginTop: '3vh', alignItems: 'center', padding: '1em', backgroundColor: 'rgb(0, 170, 255)', borderColor: 'black', borderWidth: 1, borderRadius: 8 }} onPress={() => navigation.navigate('CreateEvent', { user: userInfo })}>
          <Text style={{ color: 'white' }}>Create Event</Text>
        </Pressable>
      </View>

      <Filters
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        handleDateChange={handleDateChange}
        handleTimeChange={handleTimeChange}
        onFilterPress={handleFilterButtonPress}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <EventList
        events={events}
        handleRSVP={handleRSVP}
        handleViewDetails={handleViewDetails}
        handleReportPost={handleReportPost}
        userInfo={userInfo}
      />

      {rsvpMessage ? (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 }}>
          <Text style={{ color: 'white' }}>{rsvpMessage}</Text>
        </View>
      ) : null}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default BrowseEvents;
