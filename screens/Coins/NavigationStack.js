import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Countries from "./Countries";
import Coins from "./Coins";
import CoinInformation from "./CoinInformation";

const Stack = createNativeStackNavigator();

export default function NavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Countries" component={Countries} />
      <Stack.Screen name="Coins" component={Coins} />
      <Stack.Screen name="Coin information" component={CoinInformation} />
    </Stack.Navigator>
  );
}
