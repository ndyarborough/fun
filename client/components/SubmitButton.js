import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
const SubmitButton = ({ onPress, title }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('12%')
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SubmitButton;
