import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './screens/HomePage';
import Coins from './screens/Coins';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CoinStack from './screens/CoinStack';
import { useEffect } from 'react';
import { CoinRepository, initializeDB } from './repository/CoinRepository';

const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    initializeDB();
  }, [])




  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'gold',
          tabBarInactiveTintColor: 'grey',
        })}
        >
          <Tab.Screen name="Home" component={HomePage}/>
          <Tab.Screen name="Coins" component={CoinStack}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
