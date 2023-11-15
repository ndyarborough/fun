import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet } from 'react-native';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import eventApi from '../api/eventApi';
import 'react-time-picker/dist/TimePicker.css';

const EditEvent = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState(route.params.user);
  const [event, setEvent] = useState(null);
  const { eventId } = route.params;
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    eventApi.getEvent(eventId).then((eventData) => {
      console.log(eventData);
      setEvent(eventData);
    });
  }, [eventId]);

  const [formData, setFormData] = useState({
    eventName: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    address: '',
    capacity: '',
    description: '',
    host: '', // Assuming host is part of formData
    recurring: false,
  });

  useEffect(() => {
    // Set formData with the existing event data when it becomes available
    if (event) {
      console.log(event)
      setFormData({
        eventName: event.eventName || '',
        date: new Date(event.date) || new Date(),
        startTime: new Date(event.startTime) || '',
        endTime: new Date(event.endTime) || '',
        address: event.address || '',
        capacity: event.capacity || '',
        description: event.description || '',
        host: event.host || '', // Assuming host is part of formData
        recurring: event.recurring || false,
      });
    }
  }, [event]);

  const validateEventName = (eventName) => {
    return eventName.length > 0;
  };

  const validateAddress = (address) => {
    return address.length > 0;
  };

  const validateCapacity = (capacity) => {
    return !isNaN(parseInt(capacity)) && isFinite(capacity) && capacity > 0;
  };

  const validateTime = (time) => {
    // Add your time validation logic here if needed
    return true; // For now, assuming time is valid
  };

  const handleSubmit = async () => {
    // Perform client-side validations
    const errors = [];

    if (!validateEventName(formData.eventName)) {
      errors.push('Event Name is required');
    }

    if (!validateAddress(formData.address)) {
      errors.push('Address is required');
    }

    if (!validateCapacity(formData.capacity)) {
      errors.push('Capacity must be a number');
    }

    // Add time validations if needed
    if (!validateTime(formData.startTime)) {
      errors.push('Invalid start time');
    }

    if (!validateTime(formData.endTime)) {
      errors.push('Invalid end time');
    }

    // Update the state with validation errors
    setValidationErrors(errors);

    // If there are no validation errors, submit the form
    if (errors.length === 0) {
      // Use eventAPI to handle backend update
      console.log('updating data')
      const updateData = await eventApi.update(event._id, formData);
      if (updateData) {
        navigation.navigate('ViewProfile', { user: userInfo });
      }
    }
  };

  return (
    <View style={styles.container}>
      {validationErrors.length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Validation Errors:</Text>
          {validationErrors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              {error}
            </Text>
          ))}
        </View>
      )}
      {event && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            value={formData.eventName}
            onChangeText={(text) => setFormData({ ...formData, eventName: text })}
          />
          <Text>Date</Text>
          <DatePicker
            portalId="root-portal"
            selected={new Date(formData.date)}
            onChange={(date) => setFormData({ ...formData, date })}
          />
          <Text>Start Time</Text>
          <TimePicker
            style={styles.input}
            value={formData.startTime}
            disableClock={true}
            onChange={(time) => setFormData({ ...formData, startTime: time })}
          />
          <Text>End Time</Text>
          <TimePicker
            style={styles.input}
            value={formData.endTime}
            disableClock={true}
            onChange={(time) => setFormData({ ...formData, endTime: time })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Capacity"
            value={formData.capacity}
            onChangeText={(text) => setFormData({ ...formData, capacity: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Recurring</Text>
            <Switch
              value={formData.recurring}
              onValueChange={(value) => setFormData({ ...formData, recurring: value })}
            />
          </View>
          <Button title="Submit" onPress={handleSubmit} color="blue" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#FFD2D2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default EditEvent;
