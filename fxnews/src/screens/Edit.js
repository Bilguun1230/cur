import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const user = {
  name: 'Билгүүн',
  email: 'bilguun@example.com',
  phone: '99024312',
  profilePicture: 'https://via.placeholder.com/100', // Replace with a real image URL if available
};

const Edit = () => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Хувийн мэдээлэл</Text>
      
      <Text style={styles.inputLabel}>Нэр</Text>
      <TextInput
        style={styles.input}
        keyboardType="default"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      
      <Text style={styles.inputLabel}>Имейл</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      
      <Text style={styles.inputLabel}>Утасны дугаар</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default Edit;
