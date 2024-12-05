import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

  





const TradeScreen = () => {
  const [walletData, setWalletData] = useState({ accountBalance: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const trades = [
    {
      id: '1',
      pair: 'EUR/USD',
      type: 'Buy',
      amount: 1000,
      price: 1.2345,
      profit: 950.23,
      date: '2024-11-27',
    },
    {
      id: '2',
      pair: 'GBP/USD',
      type: 'Sell',
      amount: 2000,
      price: 1.4567,
      profit: -1268.6,
      date: '2024-11-26',
    },
    {
      id: '3',
      pair: 'JPY/USD',
      type: 'Buy',
      amount: 500,
      price: 152.50,
      profit: 149.879,
      date: '2024-11-25',
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWallet();
   
    setRefreshing(false);
  };
  useEffect(() => {
    fetchWallet(); 
  }, []);
  
  const fetchWallet = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.get('http://localhost:3000/wallet', {
        headers: { token },
      });
      setWalletData(response.data); 
    } catch (error) {
      console.error('Error fetching wallet data:', error.response?.data || error.message);
    }
  };

  const renderTradeItem = ({ item }) => (
    <View style={[styles.tradeItem, item.profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
      <View style={styles.tradeInfo}>
        <Text style={styles.pairText}>{item.pair}</Text>
        <Text style={styles.typeText}>{item.type}</Text>
        <Text style={styles.amountText}>Amount: {item.amount}</Text>
        <Text style={styles.priceText}>Price: {item.price.toFixed(4)}</Text>
      </View>
      <View style={styles.tradeProfit}>
        <Text style={styles.profitText}>${item.profit.toFixed(2)}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          ${walletData?.accountBalance ? walletData.accountBalance.toFixed(2) : '0.00'}
        </Text> 
        <Text style={styles.balanceLabel}>Үлдэгдэл</Text>
        <Text style={styles.balanceAmount}>
          ${walletData?.accountBalance ? walletData.accountBalance.toFixed(2) : '0.00'}
        </Text> 
        <Text style={styles.balanceLabel}>Худалдаж авах боломжит үлдэгдэл</Text>
        
      </View>
      

      {/* Trade List */}
      <FlatList
        data={trades}
        renderItem={renderTradeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tradesContainer}
        ListHeaderComponent={() => (
          <Text style={styles.tradesTitle}>Арилжаа</Text>
        )}
      />

      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 16,
  },
  balanceContainer: {
    backgroundColor: '#93C1BF',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  tradesContainer: {
    paddingBottom: 20,
  },
  tradesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tradeInfo: {
    flex: 1,
  },
  pairText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  typeText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 14,
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    color: '#333',
  },
  tradeProfit: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  profitText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#6C757D',
  },
  profitPositive: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  profitNegative: {
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TradeScreen;
