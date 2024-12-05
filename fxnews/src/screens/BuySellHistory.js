import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TradingScreen = () => {
  const [buySellsData, setBuySellsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuySell = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.get('http://localhost:3000/buySellHistories', {
        headers: { token },
      });
      setBuySellsData(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuySell();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.nameText}>Name: {item.name}</Text>
      {item.buy ? (
        <Text style={styles.buyText}>Худалдаж авсан: {item.buy}</Text>
      ) : null}
      {item.sell ? (
        <Text style={styles.sellText}>Зарсан: {item.sell}</Text>
      ) : null}
      <Text style={styles.dateText}>
        Date: {new Date(item.createdAt).toISOString().split('T')[0]}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Гүйлгээний Түүх</Text>
      {loading ? (
        <Text style={styles.loadingText}>Татаж байна...</Text>
      ) : (
        <FlatList
          data={buySellsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E415E',
    textAlign: 'center',
    marginVertical: 16,
  },
  historyItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E415E',
    marginBottom: 4,
  },
  buyText: {
    fontSize: 16,
    color: '#28A745',
    marginBottom: 4,
  },
  sellText: {
    fontSize: 16,
    color: '#DC3545',
    marginBottom: 4,
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

export default TradingScreen;
