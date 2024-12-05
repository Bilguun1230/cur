import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const checker = async () => {
    const token = await AsyncStorage.getItem('token', token);

    if (token) {
      navigation.navigate("Home")
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    checker()
  }, [])

  if (loading) {
    return (
      <View/>
    )
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FXNEWS</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login')} // Navigate to Login screen
      >
        <Text style={styles.buttonText}>ҮРГЭЛЖЛҮҮЛЭХ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A415E',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#4688F1',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
