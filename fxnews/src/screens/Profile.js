import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
  const navigation = useNavigation();

  const handleExitNavigate = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate("Login");
  };
  const handlebuySellHistoryNavigate = async () => {
    navigation.navigate("buySellHistory");
  };

  const handleEditNavigate = () => {
    navigation.navigate("Edit");
  };

  const handleHistoryNavigate = () => {
    navigation.navigate("History");
  };

  const user = {
    name: 'Билгүүн',
    email: 'bilguun@example.com',
    phone: '99024312',
    profilePicture: 'file:///Users/lkhagvasurenbilguun/Downloads/bussiness-man.png', 
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditNavigate}>
          <Image source={require('../../assets/images/edit.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Засах</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleHistoryNavigate}>
          <Image source={require('../../assets/images/history-book.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Гүйлгээний түүх</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlebuySellHistoryNavigate}>
          <Image source={require('../../assets/images/history-book.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Хослолын түүх</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={handleExitNavigate}>
          <Image source={require('../../assets/images/exit.png')} style={styles.icon} />
          <Text style={[styles.buttonText, styles.exitButtonText]}>Гарах</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#6C757D',
  },
  buttonsContainer: {
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exitButton: {
    backgroundColor: '#FFDADA',
  },
  exitButtonText: {
    color: '#E74C3C',
  },
});

export default UserProfile;
