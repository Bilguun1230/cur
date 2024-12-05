import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const ForexScreen = () => {
  const [currencyData, setCurrencyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); 

  const getData = async () => {
    setLoading(true);
    try {
      const urls = [
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=CAD&to_currency=USD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=GBP&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=GBP&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=MNT&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=AUD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=NZD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CHF&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CAD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=AUD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=HKD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=SGD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=GBP&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=AUD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=USD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=JPY&to_currency=AUD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=JPY&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=SGD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=HKD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=NZD&apikey=M4LIT9N2EPB2OKYU',
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=NZD&to_currency=GBP&apikey=M4LIT9N2EPB2OKYU',
      ];
  
      const calculatePercentageChange = (previousRate, currentRate) => {
        if (!previousRate || !currentRate) return 0; 
        return (((currentRate - previousRate) / previousRate) * 100).toFixed(2); 
      };
      
      const responses = await Promise.all(urls.map((url) => axios.get(url)));
      const formattedData = responses.map((response) => {
        const exchangeRateData = response.data['Realtime Currency Exchange Rate'];
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
            bidPrice: parseFloat(exchangeRateData['8. Bid Price']) || 'N/A',
            askPrice: parseFloat(exchangeRateData['9. Ask Price']) || 'N/A',
          }
        : {};
      }).filter(Boolean); // Filter out any null values in case a response is missing data
  
      setCurrencyData(formattedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getData();
  }, []);

  const handlePress = (item) => {
    navigation.navigate('PairDetail', { data: item });
  };
  const ListHeaderComponent = () => (
    <>
    <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 0 }]}>
        <Text style={styles.sectionTitle}>Хослол</Text>
        <Text style={styles.sectionTitle}>Сүүлийн ханш</Text>
        <Text style={styles.sectionTitle}>Авах ханш</Text>
      </View>
    </>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between' }]} onPress={() => handlePress(item)}>
  
      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.symbol}>
          {item.fromCurrencyCode || 'N/A'} <Text style={styles.subSymbol}>{item.toCurrencyCode || 'N/A'}</Text>
        </Text>
      </View>
  
      {/* Price Section */}
      <View style={styles.centerSection} >
        <Text style={styles.price}>{parseFloat(item.open).toFixed(4)}</Text>
      </View >

        {/* Right Section: Price Info */}
      <View style={styles.rightSection}>
        <Text style={styles.price}>{`$${parseFloat(item.askPrice).toFixed(2)}`}</Text>
        <Text
          style={[
            styles.percentageChange,
            { color: parseFloat(item.change) > 0 ? '#4CAF50' : '#E74C3C' },
          ]}
        >
          {item.change ? `${parseFloat(item.change).toFixed(2)}%` : '0.00%'}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  

  const filteredData = currencyData.filter((item) =>
    item.date.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        
        
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#2E415E" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.date}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
      <Footer />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#F5F8FA',
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E415E',
  },
  date: {
    fontSize: 14,
    color: '#2E415E',
  },
  price: {
    fontSize: 20,
    color: '#4CAF50', // Ногоон өнгө, өөрчлөлт
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 50,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chartPlaceholder: {
    flex: 1,
    alignItems: 'center',
  },
  chartLine: {
    width: 50,
    height: 20,
    borderRadius: 5,
  },
  assetPrice: {
    alignItems: 'flex-end',
  },
  change: {
    fontSize: 14,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  list: {
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },

  // New styles for CurrencyCard component
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F0F3F4', // Background color for the card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyPair: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Text color for currency pair label
  },
  largePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green', // Color for the main price
  },
  smallPrice: {
    fontSize: 16,
    color: '#888', // Color for the smaller price text
  },
});

export default ForexScreen;
