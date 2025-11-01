import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './screens/HomePage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CountryStack from './screens/Countries/CountryStack'
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
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Coins') {
              iconName = 'logo-euro';
            } else if (route.name === 'Countries') {
              iconName = 'earth-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;   //it returns an icon component
          },
        })}
        >
          <Tab.Screen name="Home" component={HomePage}/>
          <Tab.Screen name="Countries" component={CountryStack}/>          
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
