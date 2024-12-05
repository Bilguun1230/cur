import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';
import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart';
import axios from 'axios';
import { calculatePercentageChange } from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GraphComponent from '../components/graph';

const Home = () => {
  const navigation = useNavigation();
  const [currencyData, setCurrencyData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [buySellsData, setBuySellsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePairNavigate = () => navigation.navigate("Pair");
  const handleDepositNavigate = () => navigation.navigate('Deposit');
  const handleWithdrawNavigate = () => navigation.navigate('Withdraw');



  const fetchWallet = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.get('http://localhost:3000/wallet', {
        headers: { token },
      });
      setWalletData(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch wallet data');
    }
  };
  const fetchBuySell = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.get('http://localhost:3000/buySells', {
        headers: { token },
      });
      setBuySellsData(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch wallet data');
    }
  };
  

  const getData = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=M4LIT9N2EPB2OKYU'),
        axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=GBP&apikey=M4LIT9N2EPB2OKYU'),
        axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=AUD&apikey=M4LIT9N2EPB2OKYU'),
        axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=NZD&apikey=M4LIT9N2EPB2OKYU'),
        axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CHF&apikey=M4LIT9N2EPB2OKYU'),
        axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CAD&apikey=M4LIT9N2EPB2OKYU'),
        axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=M4LIT9N2EPB2OKYU'),
      ]);
  
      const formattedData = responses.map((response, index) => {
        const exchangeRateData = response.data['Realtime Currency Exchange Rate'];
       
        const calculatePercentageChange = (previousRate, currentRate) => {
          if (!previousRate || !currentRate) return 0; 
          return (((currentRate - previousRate) / previousRate) * 100).toFixed(2);
        };

        return exchangeRateData
  ? {
      fromCurrencyCode: exchangeRateData['1. From_Currency Code'] || 'N/A',
      fromCurrencyName: exchangeRateData['2. From_Currency Name'] || 'N/A',
      toCurrencyCode: exchangeRateData['3. To_Currency Code'] || 'N/A',
      toCurrencyName: exchangeRateData['4. To_Currency Name'] || 'N/A',
      date: exchangeRateData['6. Last Refreshed'] || 'N/A',
      open: parseFloat(exchangeRateData['5. Exchange Rate']) || 0,
      previousRate: parseFloat(exchangeRateData['8. Bid Price']) || 0,
      change: calculatePercentageChange(
        parseFloat(exchangeRateData['8. Bid Price']) || 0,
        parseFloat(exchangeRateData['5. Exchange Rate']) || 0
      ),
      close: parseFloat(exchangeRateData['5. Exchange Rate']) || 0,
      bidPrice: parseFloat(exchangeRateData['8. Bid Price']) || 'N/A',
      askPrice: parseFloat(exchangeRateData['9. Ask Price']) || 'N/A',
    } : {};
      });
  
      setCurrencyData(formattedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWallet();
    await fetchBuySell();
    await getData();
    setRefreshing(false);
  };

  useEffect(() => {
    getData();
    fetchWallet();
    fetchBuySell();
    fetchRealtimeData();
  }, []);

  console.log("buy", buySellsData)

  const handlePress = (item) => {
    navigation.navigate('PairDetail', { data: item });

  };

  const transformRealtimeData = (realtimeData) => {
    return [
      {
        time: new Date(realtimeData['6. Last Refreshed']).toLocaleTimeString(), // Цагийн формат
        value: parseFloat(realtimeData['5. Exchange Rate']), // Валютын ханш
      },
    ];
  };
  
  

  const fetchRealtimeData = async () => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=USD&to_symbol=JPY&interval=min&apikey=M4LIT9N2EPB2OKYU`
       
        
      );
      const realtimeData = response.data['Realtime Currency Exchange Rate'];
      if (realtimeData) {
        const formattedData = transformRealtimeData(realtimeData);
        setChartData((prevData) => [...prevData, ...formattedData]); 
      } else {
        console.error('No data available from API');
      }
    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  };

  const transformCurrencyData = (currencyData) => {
    return Object.keys(currencyData)
      .slice(0, 10)
      .map((timestamp, index) => ({
        x: index,
        y: parseFloat(currencyData[timestamp]['4. close']),
      }));
  };
  
  

  const renderItem = ({ item }) => {

    const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${item?.fromCurrencyCode}&to_symbol=${item?.toCurrencyCode}&interval=60min&apikey=M4LIT9N2EPB2OKYU`
  
  return (
    <TouchableOpacity
      style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
      onPress={() => handlePress(item)}
    >
      {/* Left Section: Currency Info */}
      <View style={styles.leftSection}>
        <Text style={styles.currencyCode}>
          {item.fromCurrencyCode} <Text style={styles.subCurrencyCode}>{item.toCurrencyCode}</Text>
        </Text>
      </View>
  
      {/* Center Section: Chart */}
      <View style={styles.centerSection}>
      <GraphComponent url={url} />


      </View>
  
      {/* Right Section: Price Info */}
      <View style={styles.rightSection}>
  <Text style={styles.price}>
    {item.askPrice ? `$${parseFloat(item.askPrice).toFixed(2)}` : '$0.00'}
  </Text>
  <Text
    style={[
      styles.percentageChange,
      {
        color: item.change
          ? parseFloat(item.change) > 0
            ? '#4CAF50' // Эерэг өөрчлөлт
            : '#E74C3C' // Сөрөг өөрчлөлт
          : '#000', // Хэрэв өөрчлөлт байхгүй бол хар өнгө
      },
    ]}
  >
    {item.change ? `${item.change}%` : '0.00%'}
  </Text>
</View>

    </TouchableOpacity>
  );
}

  const ListHeaderComponent = () => (
    <>
      <Header />
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          ${walletData?.accountBalance ? walletData.accountBalance.toFixed(2) : '0.00'}
        </Text> 
        <Text style={styles.balanceLabel}>Үлдэгдэл</Text>
        
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleDepositNavigate}>
          <Image source={require('../../assets/images/credit-card-2.png')} style={styles.icon} />
          <Text style={styles.itemText}>Орлого</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawNavigate}>
          <Image source={require('../../assets/images/cash-withdrawal.png')} style={styles.icon} />
          <Text style={styles.itemText}>Зарлага</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.assetHeader}>
        <Text style={styles.sectionTitle}>Хослол</Text>
        <Text style={styles.sectionTitle}>Сүүлийн ханш</Text>
        <Text style={styles.sectionTitle}>Авах ханш</Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={currencyData}
      renderItem={renderItem}
      keyExtractor={(item) => item.date}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={<Footer />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}     
       style={styles.container}
    />
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: 70,
    backgroundColor: '#FFFFFF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F6F4', // Light green background
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceSection: {
    flex: 1,
    alignItems: 'flex-end', 
    justifyContent: 'center',
    paddingRight: 10, 
  },
  subSymbol: {
    fontSize: 14,
    color: '#666',
  },
  largePrice: {
    fontSize: 18,
    fontWeight: 'bold',

    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  change: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20, // Increased for better spacing
    backgroundColor: '#F5F8FA',
    borderRadius: 15, // More rounded corners
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Increased elevation for better depth
  },
  pair: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF', // Тод цэнхэр өнгө
  },
  price: {
    fontSize: 16,
    color: '#4CAF50', // Ногоон өнгө, өөрчлөлт
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceContainer: {
    backgroundColor: '#B6B0B0',
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  subCurrencyCode: {
    fontSize: 14,
    color: '#666',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  percentageChange: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F6F4', // Light greenish background
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF', // White background for the icon
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    width: 40,
    height: 40,
  },
  infoContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subSymbol: {
    fontSize: 14,
    color: '#666',
  },
  pair: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between', // Optional: space between other items
    padding: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  change: {
    fontSize: 14,
    marginTop: 4,
  },
  balanceAmount: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
  },
  balanceLabel: {
    color: 'black',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#A3DDA8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawButton: {
    backgroundColor: '#FFDADA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
  },
  assetList: {
    marginBottom: 20,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
 
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
});

export default Home;
