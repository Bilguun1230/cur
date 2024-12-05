import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const token = response.data.token

      console.log("Login successful, token:", response.data.token);
      await AsyncStorage.setItem('token', token);

      navigation.navigate('Home');
    } catch (error) {
      console.log("error", error)
      Alert.alert("Login failed", error.response?.data?.message || "An error occurred");

    }
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // Бүртгүүлэх хуудас руу шилжүүлнэ
  };
  console.log("email", email)
  console.log("password", password)

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FXNEWS</Text>
      <Text style={styles.description}>
        Бид танд зориулж форекс арилжааны бүх төрлийн үйлчилгээ үзүүлнэ.
      </Text>

      <Text style={styles.label}>Нэвтрэх нэр</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="youremail@gmail.com"
          value={email}
          onChangeText={setEmail}
        />
        {email.includes('@') && (
          <Text style={styles.checkIcon}>✔</Text>
        )}
      </View>

      <Text style={styles.label}>Нууц үг</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="************"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showPasswordText}>
            {showPassword ? 'Харахгүй' : 'Харах'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLogin} // Нэвтрэх товчлуурт handleLogin функцийг оноов
      >
        <Text style={styles.loginButtonText}>НЭВТРЭХ</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={handleRegister} // Бүртгүүлэх товчлуурт handleRegister функцийг оноов
      >
        <Text style={styles.registerButtonText}>БҮРТГҮҮЛЭХ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A415E',
    textAlign: 'left',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#333',
  },
  checkIcon: {
    fontSize: 18,
    color: 'green',
    marginLeft: 5,
  },
  showPasswordText: {
    color: 'grey',
    fontSize: 14,
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#1A415E',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'gray',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
