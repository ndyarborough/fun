// RegisterForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlexInput from './FlexInput';
import SubmitButton from './SubmitButton';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext'; // Import useAppContext hook
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import userApi from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterForm = () => {
  const navigation = useNavigation();
  const { setLoggedIn, setUser } = useAppContext(); // Use the setLoggedIn function from the context

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [response, setResponse] = useState(null)

  const handleRegister = async () => {
    let errorCount = 0;
    if (fullName.length < 4 || fullName.length > 25) {
      setFullNameError('Full name must be between 4 and 25 characters.');
      errorCount++;
    }
  
    if (username.length < 4 || username.length > 12) {
      setUsernameError('Username must be between 4 and 12 characters.');
      errorCount++;
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmailDomains = ['uncc.edu', 'charlotte.edu'];
  
    if (!emailRegex.test(email) || !validEmailDomains.some(domain => email.endsWith(domain))) {
      setEmailError('Email must be a valid address ending in @uncc.edu or @charlotte.edu.');
      errorCount++;
    }
  
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      errorCount++;
    }
  
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      errorCount++;
    }
    
    // If there are validation errors, don't submit form
    if(errorCount > 0) {
      return;
    }

    const registerData = await userApi.register(username, email, password, fullName);
    if (registerData.message) {
    } else {
      await AsyncStorage.setItem('@userId', registerData.user._id)
      setLoggedIn(true);
      setUser(registerData.user);
      setResponse('Account Registered');
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View style={styles.container}>
      {fullNameError && (
        <Text style={styles.errorText}>{fullNameError}</Text>
      )}
      <Text style={styles.text}>Full Name</Text>
      <FlexInput
        type="text"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      {usernameError && (
        <Text style={styles.errorText}>{usernameError}</Text>
      )}
      <Text style={styles.text}>Username</Text>
      <FlexInput
        type="text"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      {emailError && (
        <Text style={styles.errorText}>{emailError}</Text>
      )}
      <Text style={styles.text}>Email</Text>
      <FlexInput
        type="text"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {passwordError && (
        <Text style={styles.errorText}>{passwordError}</Text>
      )}
      <Text style={styles.text}>Password</Text>
      <FlexInput
        type="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {confirmPasswordError && (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      )}
      <Text style={styles.text}>Confirm Password</Text>
      <FlexInput
        type="password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <SubmitButton onPress={handleRegister} title='Sign Up' ></SubmitButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: wp('80%')
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333', // You can change the color to your preference
  },
  errorText: {
    color: 'red'
  },
});

export default RegisterForm;
