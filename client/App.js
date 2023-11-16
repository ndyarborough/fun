import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './components/SignIn';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import EventDetails from './components/EventDetails';
import BrowseEvents from './components/BrowseEvents';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';
import Login from './components/Login';
import Message from './components/MessageScreen.js';
import InboxScreen from './components/InboxScreen.js';
import Preferences from './components/Preferences';
import Toast from 'react-native-toast-message';
import BottomNavbar from './components/BottomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  const updateUser = async (newUserInfo) => {
    const storedUserString = await AsyncStorage.getItem('@user')
    const storedUser = await JSON.parse(storedUserString)
    if (storedUser != userInfo) {
      const newUserCopy = await AsyncStorage.setItem('@user', JSON.stringify(newUserInfo))
    }

    setUserInfo(newUserInfo);
  };

  return (

    <View style={styles.app}>

      <NavigationContainer>
        <View style={styles.mainContainer}>
          <Stack.Navigator>
            <Stack.Screen name="ViewProfile">
              {(props) => <ViewProfile {...props} updateUser={updateUser} userInfo={userInfo} />}
            </Stack.Screen>
            <Stack.Screen name="SignIn">
              {(props) => <SignIn {...props} updateUser={updateUser} />}
            </Stack.Screen>

            <Stack.Screen name="EditProfile">
              {(props) => <EditProfile {...props} updateUser={updateUser} userInfo={userInfo} />}
            </Stack.Screen>
            <Stack.Screen name="Login">
              {(props) => <Login {...props} updateUser={updateUser} />}
            </Stack.Screen>
            <Stack.Screen name="InboxScreen">
              {(props) => <InboxScreen {...props} updateUser={updateUser} userInfo={userInfo} />}
            </Stack.Screen>

            <Stack.Screen name="Preferences">
              {(props) => <Preferences {...props} updateUser={updateUser} userInfo={userInfo} />}
            </Stack.Screen>

            <Stack.Screen name="Message">
              {(props) => <Message {...props} senderId={userInfo._id} />}
            </Stack.Screen>

            <Stack.Screen name="BrowseEvents">
              {(props) => <BrowseEvents {...props} updateUser={updateUser} userInfo={userInfo} />}
            </Stack.Screen>
            <Stack.Screen name="EventDetails">
              {(props) => <EventDetails {...props} updateUser={updateUser} userInfo={userInfo} />}
            </Stack.Screen>
            <Stack.Screen name="CreateEvent" component={CreateEvent} />
            <Stack.Screen name="EditEvent" component={EditEvent} />
            <Stack.Screen name="BottomNavbar" component={BottomNavbar} />
          </Stack.Navigator>
        </View>
        <View style={styles.navbar}>
          <BottomNavbar user={userInfo} />
        </View>
      </NavigationContainer>




      <Toast />
    </ View>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: 'white',
    width: '100vw',
    height: '100vh',
    flex: 1,
    alignItems: 'center'
  },
  mainContainer: {
    width: '100%',
    height: '90%',
    borderColor: 'black',
    borderWidth: 1
  },
  navbar: {
    width: '100%',
    height: '10%',
  }
})

export default App;
