// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Platform, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './components/AppContext';

import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import EditEventForm from './components/EditEventForm';
import Navbar from './components/Navbar';
import BrowseScreen from './components/BrowseScreen';
import EventFormScreen from './components/EventFormScreen';
import EventDetails from './components/EventDetails';
import Preferences from './components/Preferences';
import SendMessageScreen from './components/SendMessageScreen';
import Inbox from './components/Inbox';
import ViewProfile from './components/ViewProfile';
import Logo from './assets/meetup-high-resolution-logo-black-transparent.png'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const Stack = createStackNavigator();

const App = () => {

  const LogoComponent = () => (
    <Image source={Logo} style={styles.logo} />
  );
  return (
    <AppProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Dashboard" component={ProfileScreen} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />

            <Stack.Screen name="Events" component={BrowseScreen} options={{
              title: 'Browse Events',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Create Event" component={EventFormScreen} options={{
              title: 'Create Event',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="View Profile" component={ViewProfile} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Edit Event" component={EditEventForm} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Event Details" component={EventDetails} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Inbox" component={Inbox} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Send Message" component={SendMessageScreen} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
            <Stack.Screen name="Preferences" component={Preferences} options={{
              title: 'Dashboard',
              headerRight: LogoComponent,
            }} />
          </Stack.Navigator>
        </View>

        <Navbar />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    ...(Platform.OS === 'web' && { paddingBottom: hp('12%') }),
  },
  logo: {
    ...(Platform.OS === 'android' ? { width: 40 } : { width: 35 }),
    ...(Platform.OS === 'android' ? { height: 40 } : { height: 35 }),
    ...(Platform.OS === 'android' ? { marginRight: 40 } : { marginRight: 40 }),
    ...(Platform.OS === 'android' ? { marginBottom: 0 } : { marginBottom: 5 }),
    marginRight: 40, // Adjust the margin as needed
    marginBottom: 5, // Adjust the margin as needed
  },
});

export default App;
