import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Coins from "./Coins";
import AddCoinScreen from "./AddCoinScreen";

const Stack = createNativeStackNavigator();

export default function CoinStack() {

  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }} 
    >
        <Stack.Screen name="Coins" component={Coins} />
        <Stack.Screen name="AddCoinScreen" component={AddCoinScreen} />
    </Stack.Navigator>
  );
}
