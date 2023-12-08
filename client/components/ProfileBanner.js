import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Image, View, Text, Pressable } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import profilePlacholder from '../assets/profile-placeholder.jpg';
import { useAppContext } from './AppContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import PreferencesIcon from '../assets/settings.png';
import SignOutIcon from '../assets/arrow.png';
import MessageIcon from '../assets/message.png';

import userApi from '../api/userApi';

const ProfileBanner = ({ notMe, randomUserId }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [randomUser, setRandomUser] = useState(null);
    const { user, setLoggedIn } = useAppContext();
    const navigation = useNavigation();

    useEffect(() => {
        if (notMe) {
            const fetchRandomUserData = async () => {
                const randomUserData = await userApi.getUserInfo(randomUserId);
                setRandomUser(randomUserData);
                setProfileImage({ uri: randomUserData.profilePic })
            }
            fetchRandomUserData();

        } else {
            setProfileImage({ uri: user.profilePic })
        }

    }, [])

    const handleLogOut = async () => {
        // Handle logout using the context function
        await AsyncStorage.removeItem('@userId');
        setLoggedIn(false);
        navigation.navigate('Login');
    }

    const handlePreferences = () => {
        navigation.navigate('Preferences');
    }

    const handleMessage = () => {
        navigation.navigate('Send Message', {
            senderId: user._id,
            receiverId: randomUserId,
        });
    }

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });


        if (!result.cancelled) {
            const uri = result.assets[0].uri

            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 500 } }], // You can adjust the options as needed
                { base64: true }
            );

            const imageForDB = `data:image/jpeg;base64,${manipulatedImage.base64}`;
            const updateProfilePic = await userApi.uploadProfilePic(user._id, imageForDB);

            setProfileImage({ uri: imageForDB });
        }
    };

    return (
        <ImageBackground source={require('../assets/profile-background.webp')} style={styles.banner}>

            {notMe ?
                <Pressable onPress={handlePickImage} style={styles.profileContainer}>
                    {randomUser ? (
                        <Image style={styles.profileImage} source={profileImage} />
                    ) : (
                        <Image style={styles.profilePlacholder} source={profilePlacholder} />
                    )}
                </Pressable>
                :
                <Pressable onPress={handlePickImage} style={styles.profileContainer}>
                    {profileImage ? (
                        <Image style={styles.profileImage} source={profileImage} />
                    ) : (
                        <Image style={styles.profilePlacholder} source={profilePlacholder} />
                    )}
                </Pressable>
            }

            {notMe && randomUser ?
                <Text style={styles.fullName}>{randomUser.username}</Text>
                :
                <Text style={styles.fullName}>{user.username}</Text>
            }

            {notMe ?
                <View style={styles.userButtons}>
                    <Pressable style={styles.button} onPress={handleMessage}>
                        <Image style={styles.icon} source={MessageIcon}></Image>
                        <Text style={styles.text}>Send Message</Text>
                    </Pressable>
                </View>
                :
                <View style={styles.userButtons}>
                    <Pressable style={styles.button} onPress={handlePreferences}>
                        <Image style={styles.icon} source={PreferencesIcon}></Image>
                        <Text style={styles.text}>Preferences</Text>
                    </Pressable>

                    <Pressable style={styles.button} onPress={handleLogOut}>
                        <Image style={styles.icon} source={SignOutIcon}></Image>
                        <Text style={styles.text}>Sign Out</Text>
                    </Pressable>
                </View>
            }
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    banner: {
        width: wp('100%'),
        minHeight: hp('33%'),
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: hp('2%'),
        marginBottom: hp('1%')
    },
    profileContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        marginTop: 12
    },
    profilePlacholder: {
        width: 150,
        height: 150,
    },
    profileImage: {
        width: 150,
        height: 150,
    },
    fullName: {
        marginTop: 25,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    userButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: hp('2%')
    },
    button: {
        backgroundColor: '#fff', // Change the background color as needed
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row',
        border: '2px solid white', // Add white border
    },
    text: {
        color: 'black', // Change the text color as needed
        fontSize: 12,
        fontWeight: 'bold',
    },
    icon: {
        height: 20,
        width: 20,
        marginRight: 8,
    },
    
});

export default ProfileBanner;