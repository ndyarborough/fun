import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import UserWithOptions from './UserWithOptions';
import { useAppContext } from './AppContext';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const EventInfo = ({ event, hostData }) => {
    const navigation = useNavigation();
    const { getCurrentUser } = useAppContext();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    const handleEditPress = () => {
        navigation.navigate('Edit Event', { event })
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.headerText}>{event.eventName}</Text>
                {event.host._id === getCurrentUser()._id && (
                    <Pressable
                        style={styles.editIconContainer}
                        onPress={handleEditPress}
                    >
                        <Text>Edit Event</Text>
                        <Image
                            source={require('../assets/edit.png')}
                            style={styles.editIcon}
                        />
                    </Pressable>
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{formatDate(event.date)}</Text>
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

            <View style={styles.hostContainer}>
                <Text style={styles.hostLabel}>Host:</Text>
                {hostData ? (
                    <UserWithOptions
                        randomUser={hostData}
                        senderId={getCurrentUser()._id}
                        receiverId={hostData._id}
                    />
                ) : (
                    <Text>Loading host data...</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    value: {
        flex: 1,
    },
    username: {
        marginRight: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    hostContainer: {
        paddingTop: 20
    },
    hostLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10
    },
    tagContainer: {
        marginBottom: 10,
    },
    editIconContainer: {
        marginTop: 10,
        marginRight: 8,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center'
    },
    editIcon: {
        height: 25,
        width: 25,
        marginLeft: 8
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        borderRadius: 8,
        backgroundColor: 'lightgray',
        elevation: 2,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        overflow: 'hidden', // This ensures that the border-radius is applied correctly
        borderWidth: 1,
        borderColor: 'transparent', // Set border color to transparent for no color
        padding: 5,
        marginRight: 5,
    },
});

export default EventInfo;
