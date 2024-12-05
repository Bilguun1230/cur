import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleRegister = async () => {
    // Registration data
    const registrationData = { email, password, name: phone };

    try {
      // Send registration data to backend
      const response = await axios.post('http://localhost:3000/signup', registrationData);

      // Navigate to login and show success message
      Alert.alert("Амжилттай", "Амжилттай бүртгэлээ. Нэвтрэн орно уу.");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Алдаа", error.response?.data?.message || "Бүртгүүлэхэд алдаа гарлаа. Дахин оролдон уу.");
    }
  };

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

      <Text style={styles.label}>Утасны дугаар</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Утасны дугаар"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
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
        style={styles.registerButton}
        onPress={handleRegister}
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
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1A415E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#1A415E',
  },
  registerButton: {
    backgroundColor: '#1A415E',
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

export default Register;
