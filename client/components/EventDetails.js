import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import userApi from '../api/userApi';
import eventApi from '../api/eventApi';
import EventInfo from './EventInfo';
import RSVPList from './RSVPList';
import InterestedList from './InterestedList';
import EventPictures from './EventPictures';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useAppContext } from './AppContext';
import { useNavigation } from '@react-navigation/native';

const EventDetails = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;

    const [hostData, setHostData] = useState(null);
    const [rsvps, setRsvps] = useState(null);
    const [interested, setInterested] = useState(null);

    const {user} = useAppContext();
  
    useEffect(() => {
        
        const fetchData = async () => {
            const host = await userApi.getUserInfo(event.host._id);
            const rsvpsData = await eventApi.getRsvpList(event._id);
            const interestedData = await eventApi.getInterestedList(event._id);
            setHostData(host);
            setRsvps(rsvpsData);
            setInterested(interestedData);
        };

        fetchData();
    }, [event.host, event._id]);

    const handleEditPress = () => {
        navigation.navigate('Edit Event', {event})
        
    }

    const renderTags = () => {
        return (
            <View style={styles.tagContainer}>
                <Text style={styles.headerText}>Tags</Text>
                <View style={styles.tagList}>
                    {event.tags && event.tags.length > 0 ? (
                        event.tags.map((tag, index) => (
                            <Text key={index} style={styles.tag}>
                                {tag}
                            </Text>
                        ))
                    ) : (
                        <Text>No tags available</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <FlatList
            style={styles.container}
            data={[{ key: 'pictures' }, { key: 'eventInfo' }, { key: 'tags' }, { key: 'rsvps' }, { key: 'interested' }]}
            renderItem={({ item }) => {
                switch (item.key) {
                    case 'pictures':
                        return <EventPictures pictures={event.pictures} />;
                        case 'eventInfo':
                            return hostData ? (
                                <>
                                    <EventInfo event={event} hostData={hostData} />
                                    {event.host._id === user._id && (
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
                                </>
                            ) : null;
                    case 'tags':
                        return renderTags();
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
    tagContainer: {
        marginBottom: 20,
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#ddd',
        padding: 5,
        borderRadius: 8,
        marginRight: 5,
        marginBottom: 5,
    },
    editIcon: {
        height: 25,
        width: 25
    }
});

export default EventDetails;
