import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = () => {
  const [walletHistories, setWalletHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletHistories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get('http://localhost:3000/walletHistories', {
        headers: { token }
      });
      
      setWalletHistories(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch wallet histories');
      console.log("Fetch Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletHistories();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.typeText}>Type: {item.balanceType.toUpperCase()}</Text>
      <Text style={[styles.amountText, item.balanceType.toLowerCase() === 'deposit' ? styles.depositText : styles.withdrawText]}>
        Amount: ${item.balance}
      </Text>
      <Text style={styles.dateText}>Date: {new Date(item.createdAt).toISOString().split('T')[0]}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Гүйлгээний түүх</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={walletHistories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E415E',
    textAlign: 'center',
    marginVertical: 16,
  },
  historyItem: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E415E',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  depositText: {
    color: '#28A745',
  },
  withdrawText: {
    color: '#DC3545',
  },
  dateText: {
    fontSize: 14,
    color: '#6C757D',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default History;
