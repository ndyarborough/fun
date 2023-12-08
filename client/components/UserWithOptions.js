// UserWithOptions.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';
import userApi from '../api/userApi';
import Toast from 'react-native-root-toast';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
const UserWithOptions = ({ randomUser, receiverId }) => {
  const { user } = useAppContext();
  const navigation = useNavigation();

  const showToast = (message, backgroundColor) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: -80,
      shadow: true,
      backgroundColor,
      animation: true,
    });
  };

  const handlePressMessage = () => {
    navigation.navigate('Send Message', {
      senderId: user._id,
      receiverId,
    });
  };

  const handleProfilePress = () => {
    if (user._id === randomUser._id) {
      navigation.navigate('Dashboard')
    } else {
      navigation.navigate('View Profile', { randomUser: randomUser._id })
    }
  }

  const handleBlock = async () => {
    try {
      const blockAttempt = await userApi.blockUser(user._id, receiverId);
      if (blockAttempt === 'blocked') {
        showToast(`You have blocked ${randomUser.username}!`, 'orangered');
      } else {
        showToast(`No longer blocking ${randomUser.username}`, 'green');
      }
      return blockAttempt;
    } catch (err) {
      showToast(`Error blocking ${receiverId}`);
    }
  };

  return (
    <View style={styles.userContainer}>
      <View style={styles.profileContainer}>
        {randomUser.profilePic && (
          <Pressable onPress={handleProfilePress}>
            <Image
              source={{ uri: randomUser.profilePic }}
              style={styles.profilePic}
            />
          </Pressable>
        )}
        <Pressable onPress={handleProfilePress}>
          <Text style={styles.username}>{randomUser.username}</Text>
        </Pressable>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable onPress={handlePressMessage}>
          <Image source={require('../assets/message.png')} style={styles.icon} />
        </Pressable>
        <Pressable onPress={handleBlock}>
          <Image source={require('../assets/blockUser.png')} style={styles.icon} />
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'space-between', // Align items to the start and buttons to the end    
    padding: 8,
    flex: 1,
    marginBottom: 7,
    width: wp('99%')
  },
  profileContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start'
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half of width and height to make it a perfect circle
    marginRight: 10,
  },
  username: {
    marginRight: 10,
    marginTop: 7.5,
    fontSize: 18
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end', // Align buttons to the end of the row
    marginRight: 8
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 5,
  },
});

export default UserWithOptions;
