import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Countries from "./Countries";
import Coins from "../Coins/Coins";
import CoinInformation from "../Coins/CoinInformation";

const Stack = createNativeStackNavigator();

export default function NavigationStack() {

  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: true,
        }} 
    >
        <Stack.Screen name="Countries" component={Countries} />
        <Stack.Screen name="Coins" component={Coins}/>
        <Stack.Screen name="Coin information" component={CoinInformation} />      
        
    </Stack.Navigator>
  );
}
