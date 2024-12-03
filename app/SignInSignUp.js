import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SignInSignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to validate the email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate the password (Has to be at least 6 characters)
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleSignIn = useCallback(() => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }
    // Navigate to Home on successful sign-in
    navigation.navigate('Main', { screen: 'Home' });
  }, [email, password, navigation]);

  const handleSignUp = useCallback(() => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }
    
    Alert.alert('Sign Up', 'Sign up successful!');
    navigation.navigate('Main', { screen: 'Home' }); 
  }, [email, password, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DFF2D8',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D5F2E',
  },
  input: {
    width: '100%',
    padding: 14,
    fontSize: 20,
    fontWeight: '500', 
    borderWidth: 1,
    borderColor: '#A3D5A6', 
    borderRadius: 5,
    backgroundColor: '#B2EBF2', 
    color: '#000000', 
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F5F1E6', 
    borderRadius: 10,
    borderWidth: 2, 
    borderColor: '#B5A786', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    backgroundColor: '#4A4A4A',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default SignInSignUp;
