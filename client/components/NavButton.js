import React from 'react';
import { Pressable, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useAppContext } from './AppContext';

const NavButton = ({ to, title, icon }) => {
  const {setActiveScreen} = useAppContext();
  const navigation = useNavigation();
  const handlePress = () => {
    setActiveScreen(title)
    navigation.navigate(`${to}`);
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Image style={styles.icon} source={icon}></Image>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    button: {
      padding: 0,
      borderRadius: 15,
      alignItems: 'center',
    },
    text: {
      marginTop: 4,
      color: 'black',
      fontSize: 12
    },
    icon: {
      height: 35,
      width: 35
    }
  });

export default NavButton;
