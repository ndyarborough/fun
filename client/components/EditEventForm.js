import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import FlexInput from './FlexInput';
import SubmitButton from './SubmitButton';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import MultiImagePicker from './MultiImagePicker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';
import Tags from 'react-native-tags';
import eventApi from '../api/eventApi';

const EditEventForm = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;
    const { user, setMyEvents, setBrowseEvents } = useAppContext();


    const [eventName, setEventName] = useState(event.eventName);
    const [description, setDescription] = useState(event.description);
    const [date, setDate] = useState(new Date(event.date));
    const [startTime, setStartTime] = useState(new Date(event.startTime));
    const [endTime, setEndTime] = useState(new Date(event.endTime));
    const [capacity, setCapacity] = useState(event.capacity.toString());
    const [address, setAddress] = useState(event.address);
    const [images, setImages] = useState(event.pictures);
    const [tags, setTags] = useState(event.tags || []);
    const [capacityError, setCapacityError] = useState(null);
    const [eventNameError, setEventNameError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [addressError, setAddressError] = useState(null);

    useEffect(() => {
        setEventName(event.eventName);
        setDescription(event.description);
        setDate(new Date(event.date));
        setStartTime(new Date(event.startTime));
        setEndTime(new Date(event.endTime));
        setCapacity(event.capacity.toString());
        setAddress(event.address);
        setImages(event.pictures);
        setTags(event.tags || []);
    }, [event]);

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const handleStartTimeChange = (selectedTime) => {
        setStartTime(selectedTime);
    };

    const handleEndTimeChange = (selectedTime) => {
        setEndTime(selectedTime);
    };

    const handleTagChange = (tags) => {
        setTags(tags);
    };

    const handleImagesSelected = async (selectedImages) => {
        try {
            const imageUris = selectedImages.map((image) => image.uri);

            // Convert image URIs to base64 for Android using Expo's ImageManipulator
            const imageFiles = await Promise.all(
                imageUris.map(async (uri) => {
                    const manipulatedImage = await ImageManipulator.manipulateAsync(
                        uri,
                        [{ resize: { width: 500 } }], // You can adjust the options as needed
                        { base64: true }
                    );

                    return `data:image/jpeg;base64,${manipulatedImage.base64}`;
                })
            );

            // Store the base64-encoded data in state
            setImages(imageFiles);
        } catch (error) {
            console.error('Error converting images:', error);
        }
    };

    const handleSubmit = async () => {
        // Similar validation logic as in EventFormScreen
        let errorCount = 0;
        if (!/^\d+$/.test(capacity) || parseInt(capacity) < 1 || parseInt(capacity) > 100) {
            setCapacityError('Capacity must be a number between 1 and 100');
            errorCount++;
        }
        if (eventName.length < 4 || eventName.length > 20) {
            setEventNameError('Event name must be between 4 and 20 characters');
            errorCount++;
        }
        if (description.length > 250) {
            setDescriptionError('Description must be less than 250 characters');
            errorCount++;
        }
        if (address.length < 3) {
            setAddressError('Address should be between at least 3 characters');
            errorCount++;
        }

        if (errorCount > 0) return;

        // Create an event object
        const editedEvent = {
            _id: event._id, // Assuming event has an _id field
            host: user._id, // Assuming user is the logged-in user from the context
            eventName,
            description,
            date: date.toISOString(),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            address,
            capacity: parseInt(capacity),
            pictures: images,
            tags,
        };

        // Call the API function for editing the event
        const updatedEvent = await eventApi.edit(editedEvent._id, editedEvent);
        console.log('updatedEvent: ', updatedEvent);
        console.log('updatedEventLength: ', updatedEvent.pictures.length);

        // Update the events in context
        setMyEvents((prevEvents) => prevEvents.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)));
        setBrowseEvents((prevEvents) => prevEvents.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)));

        // Navigate to the event details screen
        navigation.navigate('Event Details', { event: updatedEvent });
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                {eventNameError ? <Text style={styles.errorText}>{capacityError}</Text> : null}
                <Text>Event Name</Text>
                <FlexInput
                    placeholder="Event Name"
                    value={eventName}
                    onChangeText={(text) => setEventName(text)}
                />
                {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
                <Text>Description</Text>
                <FlexInput
                    placeholder="Description"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                />

                <Text>Tags</Text>
                <Tags
                    initialTags={tags}
                    onChangeTags={handleTagChange}
                    containerStyle={{ justifyContent: 'flex-start' }}
                    inputStyle={{ backgroundColor: 'white' }}
                />

                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Date</Text>
                    <DatePicker label="Date" date={date} onChange={handleDateChange} />
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Start Time</Text>
                    <TimePicker label="Start Time" time={startTime} onChange={handleStartTimeChange} />
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>End Time</Text>
                    <TimePicker label="End Time" time={endTime} onChange={handleEndTimeChange} />
                </View>
                {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
                <Text>Address</Text>
                <FlexInput
                    placeholder="Address"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
                {capacityError ? <Text style={styles.errorText}>{capacityError}</Text> : null}
                <Text>Capacity</Text>
                <FlexInput
                    placeholder="Capacity"
                    value={capacity}
                    onChangeText={(text) => setCapacity(text)}
                    keyboardType="numeric"
                />

                <MultiImagePicker onImagesSelected={handleImagesSelected} initialImages={images} />

                <SubmitButton style={styles.submit} title="Submit" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between', // Align children with space in between
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
    },
    dateLabel: {
        marginRight: 10,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Add vertical margin
    },
    image: {
        width: 125, // Set the desired width
        height: 125, // Set the desired height
    },
    submit: {
        marginBottom: 20, // Add some margin at the bottom
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
});

export default EditEventForm;
