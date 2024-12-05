import React from 'react';
import { Image, View } from 'react-native';
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';

import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import Trade from './src/screens/Trade';
import News from './src/screens/News';
import Pair from './src/screens/Pair';
import Profile from './src/screens/Profile';
import Deposit from './src/screens/Deposit';
import Withdraw from './src/screens/Withdraw';
import NewsDetail from './src/screens/NewsDetail';
import PairDetail from './src/screens/PairDetail';
import Edit from './src/screens/Edit';
import BuySell from './src/screens/BuySellHistory';
import History from './src/screens/History';
// import depositDetail from './src/screens/depositDetail';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: 'white', // Active tab text color
      tabBarInactiveTintColor: 'gray', // Inactive tab text color
      tabBarStyle: {
        position: 'absolute', // Makes the tab bar position absolute
        height: 80, // Adjust the height of the tab bar
        borderRadius: 20, // Adds rounded corners
        backgroundColor: '#0d1321', // Tab bar background color
        shadowColor: '#000', // Adds shadow for elevation
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 3.5,
        elevation: 5, // Shadow for Android
      },
      tabBarLabelStyle: {
        fontSize: 12, // Font size for labels
        color: 'white', // Label color
      },
    }}
  >
    {/* Home Tab */}
    <Tab.Screen
      name="Нүүр"
      component={Home}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Image
            source={require('./assets/images/home.png')}
            style={{ width: size, height: size, tintColor: "white" }}
          />
        ),
        tabBarLabel: "Нүүр",
      }}
    />
  
    {/* News Tab */}
    <Tab.Screen
      name="Мэдээ"
      component={News}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Image
            source={require('./assets/images/newspaper.png')}
            style={{ width: size, height: size, tintColor: "white" }}
          />
        ),
        tabBarLabel: "Мэдээ",
      }}
    />
  
    {/* Center Floating Button */}
    <Tab.Screen
      name="Арилжаа"
      component={Trade}
      options={{
        tabBarIcon: () => (
          <View
            style={{
              width: 70,
              height: 60,
              backgroundColor: '#00c897', 
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 5,
              marginBottom: 35, 
            }}
          >
            <Image
              source={require('./assets/images/transfer-2.png')}
              style={{ width: 35, height: 35, tintColor: '#fff' }}
            />
          </View>
        ),
        tabBarLabel: () => null, 
      }}
    />
  
    {/* Pair Tab */}
    <Tab.Screen
      name="Хослол"
      component={Pair}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Image
            source={require('./assets/images/chart.png')}
            style={{ width: size, height: size, tintColor: "white" }}
          />
        ),
        tabBarLabel: "Хослол",
      }}
    />
  
    {/* Profile Tab */}
    <Tab.Screen
      name="Хэрэглэгчийн мэдээлэл"
      component={Profile}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Image
            source={require('./assets/images/user.png')}
            style={{ width: size, height: size, tintColor: "white" }}
          />
        ),
        tabBarLabel: "Профайл",
      }}
    />
  </Tab.Navigator>
  
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Deposit" component={Deposit} options={{ title: "Цэнэглэх" }} />
        <Stack.Screen name="Withdraw" component={Withdraw} options={{ title: "Зарлага" }} />
        <Stack.Screen name="NewsDetail" component={NewsDetail} options={{ title: "Мэдээ дэлгэрэнгүй" }} />
        <Stack.Screen name="PairDetail" component={PairDetail} options={{ title: "Хослол дэлгэрэнгүй" }} />
        <Stack.Screen name="buySellHistory" component={BuySell} options={{ title: "Худалдан авах/Зарах" }} />
        <Stack.Screen name="Edit" component={Edit} options={{ title: "Засварлах" }} />
        <Stack.Screen name="History" component={History} options={{ title: "Түүх" }} />
        {/* <Stack.Screen name="depositDetail" component={depositDetail}  options={{ title: "Арилжаа" }}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
