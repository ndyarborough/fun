import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Pressable, FlatList, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import userApi from '../api/userApi';

const Preferences = ({ navigation, userInfo, updateUser }) => {
  const [preferences, setPreferences] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockUser, setBlockUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const userPreferences = await userApi.getPreferences(userInfo._id);

        const notificationPreference = userPreferences.receiveNotifications;
        const rsvpVisibilityPreference = userPreferences.rsvpVisibility;
        const blockedUserPreference = userPreferences.blockedUsers;
        console.log(userPreferences.blockedUsers)

        setPreferences({
          receiveNotifications: notificationPreference,
          rsvpVisibility: rsvpVisibilityPreference,
          blockedUsers: blockedUserPreference,
        });
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchUserPreferences();
  }, [userInfo._id]);

  const handleToggleNotifications = () => {
    // Toggle the state for receiving notifications
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      receiveNotifications: !prevPreferences.receiveNotifications,
    }));
  };

  const handleToggleRSVPVisibility = () => {
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      rsvpVisibility: !prevPreferences.rsvpVisibility,
    }));
  };

  const handleBlockedUser = async () => {
    try {
      const blockUserInfo = await userApi.getUserByUsername(searchQuery);
  
      // Check if the user to block is found
      if (!blockUserInfo) {
        Toast.show({
          type: 'error',
          text1: 'User not found',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
        return;
      }
  
      // Block the user using the API
      await userApi.blockUser(userInfo._id, blockUserInfo._id);
  
      // Update local state with the newly blocked user
      setBlockUser(blockUserInfo);
      setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, blockUserInfo]);
  
      // Update preferences to include the newly blocked user
      setPreferences((prevPreferences) => ({
        ...prevPreferences,
        blockedUsers: [...prevPreferences.blockedUsers, blockUserInfo],
      }));
  
      // Display a success toast message
      Toast.show({
        type: 'success',
        text1: 'User blocked successfully',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });
    } catch (error) {
      console.error('Error blocking user:', error);
  
      // Display an error toast message
      Toast.show({
        type: 'error',
        text1: 'Error blocking user',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });
    }
  };

  const handleUnblockUser = async (blockedUserId) => {
    try {
      // Remove the blocked user from the preferences
      const updatedBlockedUsers = preferences.blockedUsers.filter(
        (user) => user._id !== blockedUserId
      );

      // Make an API request to update the user with the modified preferences
      await userApi.savePreferences(userInfo._id, {
        blockedUsers: updatedBlockedUsers,
      });

      // Update the state with the modified blockedUsers array
      setPreferences((prevPreferences) => ({
        ...prevPreferences,
        blockedUsers: updatedBlockedUsers,
      }));

      // Display a success toast message
      Toast.show({
        type: 'success',
        text1: 'User unblocked successfully',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });
    } catch (error) {
      console.error('Error unblocking user:', error);

      // Display an error toast message
      Toast.show({
        type: 'error',
        text1: 'Error unblocking user',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });
    }
  };




  const handleSavePreferences = async () => {
    try {

      // Make API request to save preferences
      await userApi.savePreferences(userInfo._id, preferences);

      // Display a success toast message
      Toast.show({
        type: 'success',
        text1: 'Preferences Saved',
        visibilityTime: 3000, // 3 seconds
        autoHide: true,
        topOffset: 30,
      });
    } catch (error) {
      // Display an error toast message
      Toast.show({
        type: 'error',
        text1: 'Error saving preferences',
        visibilityTime: 3000, // 3 seconds
        autoHide: true,
        topOffset: 30,
      });
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!preferences ? <Text>Loading Preferences</Text> :
        <View>
          <Text style={styles.title}>My Preferences</Text>
          {/* Receive notifications */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>Receive Notifications</Text>
            <Switch
              value={preferences.receiveNotifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={preferences.receiveNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          {/* Rsvp Visibility */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>RSVP Visibility</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={preferences.rsvpVisibility}
                onValueChange={handleToggleRSVPVisibility}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={preferences.rsvpVisibility ? '#f5dd4b' : '#f4f3f4'}
              />
              {/* <Text>{preferences.rsvpVisibility ? 'Enabled' : 'Disabled'}</Text> */}
            </View>
          </View>
          {/* Block users */}
          <View>
            <TextInput
              style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
              placeholder="Block user..."
              onChangeText={setSearchQuery}
              value={searchQuery || ''} // Use an empty string if searchQuery is null
            />

            <Pressable onPress={handleBlockedUser} style={styles.blockButton}>
              <Text style={styles.blockButtonText}>Block User</Text>
            </Pressable>
            <Text>Blocked Users: </Text>
            <FlatList
              data={preferences.blockedUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.blockedUserContainer}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Pressable onPress={() => handleUnblockUser(item._id)}>
                    <Image source={require('../assets/delete.png')} style={styles.deleteIcon} />
                  </Pressable>
                </View>
              )}
            />

          </View>

          {/* Save Preferences Button */}
          <Pressable onPress={handleSavePreferences} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </Pressable>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  blockButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  blockButtonText: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 2,
    color: 'white',

  },
  blockedUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  username: {
    fontSize: 16,
  },

  deleteIcon: {
    width: 20, // Set the width of the delete icon
    height: 20, // Set the height of the delete icon
  },
});

export default Preferences;
