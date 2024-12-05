import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Withdraw = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardNumberDate, setCardNumberDate] = useState('');
  const [cardCode, setCardCode] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const bankApps = [
    { id: 1, name: "SocialPay", icon: require("../../assets/images/socialpay.png") },
    { id: 3, name: "Төрийн банк", icon: require("../../assets/images/statebank.png") },
    { id: 4, name: "Most Money", icon: require("../../assets/images/mostmoney.png") },
  ];

  const handleAddCardNavigate = () => {
    setIsModalVisible(true);
  };

  const handleSaveCard = () => {
    if (!cardNumber || !cardHolderName) {
      Alert.alert("Алдаа", "Бүх талбарыг бөглөнө үү!");
      return;
    }
    Alert.alert("Амжилттай", `${cardHolderName} нэртэй карт нэмэгдлээ.`);
    setSelectedCard({ id: "newCard", name: cardHolderName, cardNumber: cardNumber });
    setIsModalVisible(false);
    setCardNumber('');
    setCardHolderName('');
  };

  const handleWidthdraw = async() => {
    if (!amount) return;
    try {
      console.log("Select Method", selectedCard?.name);
      console.log("amount", amount);
      const token = await AsyncStorage.getItem('token');
      if(!token) throw new Error("Token not found");
  
      const response = await axios.post(
        "http://localhost:3000/updateWallet",
        {
          data: {
            balanceType: "WITHDRAW",
            accountBalance: parseFloat(amount),
            WithdrawMethod: selectedCard.name,
          }
        },
        {
          headers: { token: token },
        }
      );
  
      Alert.alert("Амжилттай", `${selectedCard.name} ашиглан ${amount} зарлага гаргалаа.`);
      navigation.goBack();
    } catch (error) {
      console.log("error", error);
      Alert.alert("Widthdraw failed", error.response?.data?.message || "An error occurred");
    }
  };

  const fetchWallet = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.get('http://localhost:3000/wallet', {
        headers: { token: token },
      });
      setWalletData(response.data);
    } catch (error) {
      Alert.alert('Алдаа', error.response?.data?.error || 'Failed to fetch wallet data');
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Зарлага</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Таны үлдэгдэл:</Text>
        <Text style={styles.balanceAmount}>
          {walletData?.accountBalance ? `${walletData.accountBalance.toFixed(2)}₮` : "0.00₮"}
        </Text>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Банкны карт</Text>
        <TouchableOpacity
          style={[
            styles.cardItem,
            selectedCard?.id === "addCard" && styles.selectedItem,
          ]}
          onPress={handleAddCardNavigate}
        >
          <Text style={styles.cardText}> + Карт нэмэх </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bankAppsSection}>
        <Text style={styles.sectionTitle}>Банкны апп</Text>
        <FlatList
          data={bankApps}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.bankAppItem,
                selectedCard?.id === item.id && styles.selectedItem,
              ]}
              onPress={() => setSelectedCard(item)}
            >
              <Image source={item.icon} style={styles.bankAppIcon} />
              <Text style={styles.bankAppText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={styles.inputLabel}>Зарлага дүн:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Жишээ: 10000.00₮"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleWidthdraw}>
        <Text style={styles.buttonText}>Зарлага</Text>
      </TouchableOpacity>

      {/* Modal for Adding Card */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Карт нэмэх</Text>
            <Text style={styles.label} > Банкны картын дугаар*</Text>
            <TextInput
              style={styles.input}
              placeholder="4200 0000 0000 0000"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <Text style={styles.label}> Нэр*</Text>
            <TextInput
              style={styles.input}
              placeholder="Карт эзэмшигчийн нэр"
              value={cardHolderName}
              onChangeText={setCardHolderName}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={styles.label}> Хүчинтэй хугацаа</Text>
            <TextInput
              style={[styles.input, { width: 120, height: 40 }]}
              placeholder="MM/YY"
              keyboardType="numeric"
              value={cardNumberDate}
              onChangeText={setCardNumberDate}
            />
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={styles.label}> CVV код*</Text>
            <TextInput
              style={[styles.input, { width: 120, height: 40 }]}
              placeholder="999"
              keyboardType="numeric"
              value={cardCode}
              onChangeText={setCardCode}
            />
            </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSaveCard}>
              <Text style={styles.buttonText}>Хадгалах</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label:{
    fontsize: 14,
    marginBottom: 8,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#333",
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginTop: 5,
  },
  cardSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  cardItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    color: "black",
  },
  selectedItem: {
    borderColor: "#00BFFF",
    borderWidth: 2,
  },
  bankAppsSection: {
    marginBottom: 20,
  },
  bankAppItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  bankAppIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  bankAppText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
 
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#C9F2EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Withdraw;