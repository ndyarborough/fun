import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import userApi from '../api/userApi';
import eventApi from '../api/eventApi';
import EventInfo from './EventInfo';
import RSVPList from './RSVPList';
import InterestedList from './InterestedList';
import EventPictures from './EventPictures';
import { useAppContext } from './AppContext';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const EventDetails = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;

    const [hostData, setHostData] = useState(null);
    const [rsvps, setRsvps] = useState(null);
    const [interested, setInterested] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added loading state

    const { user } = useAppContext();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const host = await userApi.getUserInfo(event.host._id);
                const rsvpsData = await eventApi.getRsvpList(event._id);
                const interestedData = await eventApi.getInterestedList(event._id);
                setHostData(host);
                setRsvps(rsvpsData);
                setInterested(interestedData);
                setIsLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Set loading to false even in case of an error
            }
        };
        fetchData();
    }, [event.host, event._id]);

    if (isLoading) {
        // Display a loading indicator while the data is being fetched
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadMessage}>Loading Event Details</Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            data={[{ key: 'pictures' }, { key: 'eventInfo' }, { key: 'rsvps' }, { key: 'interested' }]}
            renderItem={({ item }) => {
                switch (item.key) {
                    case 'pictures':
                        return <EventPictures pictures={event.pictures} />;
                    case 'eventInfo':
                        return hostData ? <EventInfo event={event} hostData={hostData} /> : null;
                    case 'rsvps':
                        return rsvps ? <RSVPList rsvps={rsvps} /> : null;
                    case 'interested':
                        return interested ? <InterestedList interested={interested} /> : null;
                    
                    default:
                        return null;
                }
            }}
            keyExtractor={(item) => item.key}
        />
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadMessage: {
        marginTop: 10
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    value: {
        flex: 1,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    hostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 12,
        padding: 8,
        flex: .6,
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
    rsvpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    
});

export default EventDetails;
