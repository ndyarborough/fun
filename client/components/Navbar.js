// Navbar.js
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import NavButton from './NavButton';
import { useAppContext } from './AppContext';
import { useNavigation } from '@react-navigation/native';

import BrowseIcon from '../assets/dashboard.webp';
import DashboardIcon from '../assets/home.webp';
import MessageIcon from '../assets/message.webp';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Navbar = () => {
  const { loggedIn, user, activeScreen } = useAppContext();

  return (
    <View style={[styles.container, !loggedIn && styles.hidden]}>
      <View style={styles.barContainer}>
        <View style={[styles.bar, activeScreen === 'Dashboard' && styles.activeBar]} />
        <NavButton
          title="Dashboard"
          to="Dashboard"
          user={user}
          icon={DashboardIcon}
        />
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.bar, activeScreen === 'Events' && styles.activeBar]} />
        <NavButton
          title="Events"
          to="Events"
          user={user}
          icon={BrowseIcon}
        />
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.bar, activeScreen === 'Messages' && styles.activeBar]} />
        <NavButton
          title="Messages"
          to="Inbox"
          user={user}
          icon={MessageIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    height: hp('10%'),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingBottom: Platform.OS === 'android' ? 3 : 18,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 35, // Adjust the width of the bar
    height: 6, // Adjust the height of the bar (thicker)
    borderRadius: 15,
    backgroundColor: 'transparent',
    marginBottom: 8
  },
  activeBar: {
    backgroundColor: 'orange', // Set the color of the active bar
  },
  hidden: {
    display: 'none',
  },
});

export default Navbar;
