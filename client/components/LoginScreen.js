// LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import LoginForm from './LoginForm';
import NavButton from './NavButton';
import { useAppContext } from './AppContext'; // Import the useAppContext hook
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
const LoginScreen = () => {
  const navigation = useNavigation();
  const { setLoggedIn, setUser } = useAppContext(); // Use the context values

  const handlePress = () => {
    navigation.navigate('Register')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <LoginForm />
      <Text>or</Text>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>Sign Up</Text>
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
    backgroundColor: 'white'
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
    width: wp('80%')
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
