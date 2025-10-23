import { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoinRepository } from "../repository/CoinRepository";

export default function AddCoinScreen({ navigation, route }) {
  const existingCoin = route.params?.coin;

  const [newCoin, setNewCoin] = useState({
    id: existingCoin?.id || null,
    name: existingCoin?.name || '',
    country: existingCoin?.country || '',
    year: existingCoin?.year?.toString() || '',
    condition: existingCoin?.condition || '',
    amount: existingCoin?.amount?.toString() || 0,
    url: existingCoin?.url || '',
  });

  const HandleSave = async () => {
    if (newCoin.id) {
      await CoinRepository.updateCoin(newCoin);
    }

    navigation.goBack();
  };



  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium">Add a New Coin</Text>

      <TextInput 
        label="Coin Name"
        value={newCoin.name}
        onChangeText={(text) => setNewCoin({ ...newCoin, name: text })}
        style={styles.textInputs}
        disabled
      />

      <TextInput 
        label="Country"
        value={newCoin.country}
        onChangeText={(text) => setNewCoin({ ...newCoin, country: text })}
        style={styles.textInputs}
        disabled
      />

      <TextInput 
        label="Year"
        value={newCoin.year}
        onChangeText={(text) => setNewCoin({ ...newCoin, year: text })}
        style={styles.textInputs}
        keyboardType="numeric"
        disabled
      />

      <TextInput 
        label="Condition"
        value={newCoin.condition}
        onChangeText={(text) => setNewCoin({ ...newCoin, condition: text })}
        style={styles.textInputs}
      />

      <TextInput 
        label="Amount"
        value={newCoin.amount}
        onChangeText={(text) => setNewCoin({ ...newCoin, amount: text })}
        style={styles.textInputs}
        keyboardType="numeric"
      />

      <TextInput 
        label="Url"
        value={newCoin.url}
        onChangeText={(text) => setNewCoin({ ...newCoin, url: text})}
        style={styles.textInputs}
      />

      <Button
        mode='contained'
        label="Save"
        onPress={HandleSave}
      >
        Save
      </Button>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  textInputs: {
    width: 250,
    marginVertical: 8,
  }
});
