// RegisterScreen.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import RegisterForm from './RegisterForm';
import NavButton from './NavButton';
import { useAppContext } from './AppContext'; // Import the useAppContext hook
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { setLoggedIn, setUser } = useAppContext(); // Use the context values

  const handlePress = () => {
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <RegisterForm />
      <Text>or</Text>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>Log in</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    width: wp('70%')
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
