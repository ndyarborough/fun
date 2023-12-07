// EventActionButton.js
import React from 'react';
import { Text, Image, Pressable, StyleSheet } from 'react-native';

const EventActionButton = ({ onPress, icon, text }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Image source={icon} style={styles.icon} />
      <Text>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 3
  },
});

export default EventActionButton;