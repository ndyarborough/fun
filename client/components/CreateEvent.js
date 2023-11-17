import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import eventApi from '../api/eventApi';
import 'react-time-picker/dist/TimePicker.css';
import * as ImagePicker from 'expo-image-picker';

const CreateEvent = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState(route.params.user);

  useEffect(() => {
    const formattedStartTime = formatTime(formData.startTime);
    const formattedEndTime = formatTime(formData.endTime);

    setFormData({
      ...formData,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      host: userInfo._id,
      pictures: [] // Initialize pictures array
    });
  }, []);

  const handleImagePicker = async () => {
    const newPicture = await pickImage();
    if (newPicture) {
      setFormData({
        ...formData,
        pictures: [...formData.pictures, newPicture]
      });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      const selectedAsset = result;
      return selectedAsset ? selectedAsset.uri : null;
    } else {
      alert('You did not select any image.');
      return null;
    }
  };

  const formatTime = (time) => {
    if (typeof time === 'string') {
      // Assuming the time format is 'HH:mm am/pm'
      const [hours, minutes] = time.split(':');
      const [rawHours, ampm] = hours.split(' ');
      const formattedHours = ampm.toLowerCase() === 'pm' ? parseInt(rawHours, 10) + 12 : rawHours;
      const formattedTime = `${formattedHours}:${minutes}`;
      return formattedTime;
    } else if (time instanceof Date) {
      // If time is a Date object, format it as needed
      // Example: return `${time.getHours()}:${time.getMinutes()}`;
      return time.toISOString().substr(11, 5); // Using ISO format (HH:mm)
    }
  
    // Handle other cases if needed
    return time;
  };

  const defaultStartTime = new Date();
  const defaultEndTime = new Date();


  const [formData, setFormData] = useState({
    eventName: '',
    date: new Date(),
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    address: '',
    capacity: '',
    description: '',
    host: '',
    recurring: false,
    pictures: [] // Add pictures array to form data
  });
  const [validationErrors, setValidationErrors] = useState([]);

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
    console.log(formData)
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
      // Use eventAPI to handle backend transfer
      const sendData = await eventApi.create(formData);
      if (sendData) {
        navigation.navigate('ViewProfile', { user: userInfo });
      }
    }
  };

  return (
    <>
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
          onChange={(date) => {setFormData({ ...formData, date })}}
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
        <View style={styles.labelContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
          </TouchableOpacity>
          <Text style={styles.label}>Pictures</Text>
        </View>
        <ScrollView horizontal style={styles.imageScrollContainer}>
          {formData.pictures && formData.pictures.length > 0 ? (
            formData.pictures.map((picture, index) => (
              <Image key={index} source={{ uri: picture }} style={styles.imagePreview} />
            ))
          ) : (
            <Text style={styles.profilePicPlaceholder}>No Pictures</Text>
          )}
        </ScrollView>
        <Button title="Submit" onPress={handleSubmit} color="blue" />
      </View>
    </>
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageScrollContainer: {
    marginBottom: 10,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  plusIcon: {
    width: 20,
    height: 20,
    tintColor: 'blue',
  },
  profilePicPlaceholder: {
    color: '#999',
    fontSize: 16,
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

export default CreateEvent;
