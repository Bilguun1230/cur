import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,

  Dimensions,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart';
import AsyncStorage from '@react-native-async-storage/async-storage';



const { width } = Dimensions.get('window');

const TradingScreen = ({ route }) => {
  const [currencyData, setCurrencyData] = useState([]);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [buySells, setBuySells] = useState([]);
  const { data } = route.params;
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [showInputBox, setShowInputBox] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const openInputBox = (type) => {
    setTransactionType(type);
    setShowInputBox(true);
  };

  const closeInputBox = () => {
    setShowInputBox(false);
    setAmount('');
    setSelectedItem(null);
  };

  const handleConfirm = async () => {
    if (transactionType === 'Sell' && !selectedItem?.id) {
      Alert.alert('Аль нэгийг сонгон уу?');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Токен алга байна. Нэвтэрч орно уу.');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:3000/buySell', 
        {
          data: {
            name: `${data?.fromCurrencyCode}/${data?.toCurrencyCode}`,
            buy: transactionType === 'Buy' ? parseFloat(amount) : 0,
            buyPrice: transactionType === 'Buy' ? data?.bidPrice : null,
            sell: transactionType === 'Sell' ? parseFloat(amount) : 0,
            calculatedAmount: calculatedAmount || null,
            id: selectedItem?.id ?? null,
          },
        },
        {
          headers: {
            token,
          },
        }
      );
  
      Alert.alert('Амжилттай!', 'Гүйлгээ амжилттай боллоо.');
      setAmount('');
      closeInputBox();
      await fetchBuySells();
      setSelectedItem(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error in handleConfirm:', error.response?.data || error.message);
    Alert.alert('Алдаа гарлаа', error.response?.data?.message || 'Системтэй холбоотой алдаа.');
      
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

  const calculateCurrency = () => {

    if (amount) {
      setCalculatedAmount(parseFloat(amount) * data?.bidPrice)
    }

  }

  const fetchBuySells = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Токен олдсонгүй. Нэвтэрч орно уу.');
        return;
      }

      const response = await axios.get(`http://localhost:3000/buySell?name=${name}`, {
        headers: {
          token,
        },
      });

      console.log("response.data", response.data)

      setBuySells(response.data);
    } catch (error) {
      console.error('Error in fetchBuySells:', error.message);
      Alert.alert('Алдаа гарлаа', 'Мэдээлэл татаж чадсангүй.');
    }
  };

  useEffect(() => {
    if (data?.fromCurrencyCode) {
      const _url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${data?.fromCurrencyCode}&to_symbol=${data?.toCurrencyCode}&interval=60min&apikey=M4LIT9N2EPB2OKYU`;
      setUrl(_url);
      setName(`${data?.fromCurrencyCode}/${data?.toCurrencyCode}`);
    }
  }, [route.params]);

  useEffect(() => {
    if (name) {
      fetchBuySells();
    }
  }, [name]);

  useEffect(() => {
    calculateCurrency()
    if (!amount) {
      setCalculatedAmount(null)
    }
  }, [amount])
  

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const responses = await axios.get(url);
        const data = responses.data['Time Series FX (60min)'];
        setCurrencyData(data);
        setChartData(transformCurrencyData(data));
      } catch (error) {
        console.error('Error fetching currency data:', error.message);
        Alert.alert('Алдаа гарлаа', 'Ханшийн мэдээлэл татаж чадсангүй.');
      }
    };

    if (url) {
      fetchCurrencyData();
    }
  }, [url]);

  const getTotalAmount = (data) => {
    let total = 0

    data.map((_data) => {
      total += _data?.calculatedAmount || 0
    })
    return total
  }

  const handleSelect = (item) => {
    setSelectedItem(item.id === selectedItem?.id ? null : item);
  };
  console.log("data", data)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.currencyContainer}>
        <View style={styles.currencyInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.currencyIcon}
          />
          <Text style={styles.currencySymbol}>{name}</Text>
        </View>
      </View>

      <View style={styles.priceInfoContainer}>
  <View style={styles.priceInfo}>
    <Text style={styles.priceLabel}>Ханшийн үнэ:</Text>
    <Text style={styles.priceValue}>
      {data?.open ? parseFloat(data.open).toFixed(4) : 'N/A'}
    </Text>
  </View>
  <View style={styles.priceInfo}>
    <Text style={styles.priceLabel}>Зарах үнэ:</Text>
    <Text style={styles.priceValue}>
      {data?.askPrice ? parseFloat(data.askPrice).toFixed(4) : 'N/A'}
    </Text>
  </View>
  <View style={styles.priceInfo}>
    <Text style={styles.priceLabel}>Авах үнэ:</Text>
    <Text style={styles.priceValue}>
      {data?.bidPrice ? parseFloat(data.bidPrice).toFixed(4) : 'N/A'}
    </Text>
  </View>
</View>

      {chartData?.length > 0 && (
        <Chart
          style={{ height: 300, width: '100%' }}
          data={chartData}
          padding={{ left: 40, bottom: 40, right: 20, top: 20 }}
          xDomain={{ min: 0, max: chartData.length - 1 }}
          yDomain={{
            min: Math.min(...chartData.map((d) => d.y)),
            max: Math.max(...chartData.map((d) => d.y)),
          }}
        >
          <VerticalAxis
            tickCount={5}
            theme={{ labels: { formatter: (v) => v.toFixed(2) } }}
          />
          <HorizontalAxis
            tickCount={5}
            theme={{
              labels: { formatter: (v) => `${v} цаг` },
            }}
          />
          <Line theme={{ stroke: { color: '#44bd32', width: 2 } }} />
        </Chart>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buyButton} onPress={() => openInputBox('Buy')}>
          <Text style={styles.buyButtonText}>Авах</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sellButton} onPress={() => openInputBox('Sell')}>
          <Text style={styles.sellButtonText}>Зарах</Text>
        </TouchableOpacity>
      </View>

      {showInputBox && (
  <View style={styles.inputBoxContainer}>
    <Text style={styles.sheetTitle}>{transactionType} хэмжээг оруула</Text>
    
    {transactionType === 'Sell' && buySells?.length > 0 && (
        <View
          // onPress={() => handleSelect(_data)}
          style={[
            styles.item,
          ]}
        >
          <Text style={styles.text}>{buySells[0]?.name}</Text>
           <Text style={styles.text}>Total amount: {getTotalAmount(buySells)}</Text>
        </View>
    )
      // buySells.map((_data, index) => (
}

    {transactionType === "Buy" && calculatedAmount &&  (
      <Text style={{textAlign: "center", marginBottom: 10}} > 
        {calculatedAmount || ""}
      </Text>
      
    )}
    
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      placeholder="Дүн"
      value={amount}
      onChangeText={setAmount}
    />
    
    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
      <Text style={styles.confirmButtonText}>Баталгаажуулах</Text>
    </TouchableOpacity>
    
    <TouchableOpacity onPress={closeInputBox} style={styles.cancelButton}>
      <Text style={styles.cancelButtonText}>Болих</Text>
    </TouchableOpacity>
  </View>
)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 20,
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    display: "flex",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: "gray", 
  },
  text: {
    color: "black",
    marginRight: 20,
  },
  currencyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#CCC',
    marginRight: 10,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceInfoContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  currencyPair: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
    priceInfo: {
      flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    },
    
  priceLabel: {
    fontSize: 14,
    color: '#6C757D',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexDirection: 'column', 

  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 470,
  },
  timeRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  selectedTimeRangeButton: {
    backgroundColor: '#1A415E',
  },
  timeRangeText: {
    color: '#333',
  },
  selectedTimeRangeText: {
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sellButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  sellButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputBoxContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
});

export default TradingScreen;
