import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './screens/HomePage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initializeDB } from './repository/CoinRepository';
import NavigationStack from './screens/Coins/NavigationStack';
import CountryMap from './screens/Map/CountryMap';

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
            } else if (route.name === 'Map') {
              iconName = 'earth-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;   //it returns an icon component
          },
        })}
        >
          <Tab.Screen name="Home" component={HomePage}/>
          <Tab.Screen name="Coins" component={NavigationStack}/>
          <Tab.Screen name="Map" component={CountryMap}/>
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
