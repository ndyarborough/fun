// Navbar.js
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import NavButton from './NavButton';
import { useAppContext } from './AppContext';
import { useNavigation } from '@react-navigation/native';

import BrowseIcon from '../assets/browse.png';
import DashboardIcon from '../assets/dashboard.png';
import MessageIcon from '../assets/message.png';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Navbar = () => {
  const { loggedIn, user } = useAppContext();
  const { navigate, state } = useNavigation();

  // Check if state is available before accessing routeName
  const isActive = (routeName) => state && state.routeName === routeName;

  return (
    <View style={[styles.container, !loggedIn && styles.hidden]}>
      <NavButton
        title="Dashboard"
        to="Dashboard"
        user={user}
        icon={DashboardIcon}
        isActive={isActive('Dashboard')}
        onPress={navigate}
      />
      <NavButton
        title="Events"
        to="Events"
        user={user}
        icon={BrowseIcon}
        isActive={isActive('Events')}
        onPress={navigate}
      />
      <NavButton
        title="Messages"
        to="Inbox"
        user={user}
        icon={MessageIcon}
        isActive={isActive('Inbox')}
        onPress={navigate}
      />
      {/* Add more NavButton components for additional screens */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    height: hp('10%'),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingBottom: Platform.OS === 'android' ? 3 : 18,
    paddingTop: 8
  },
  hidden: {
    display: 'none',
  },
});

export default Navbar;
