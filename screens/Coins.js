import { useCallback, useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Image, Pressable } from "react-native";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoinRepository, initializeDB } from "../repository/CoinRepository";
import { useFocusEffect } from "@react-navigation/native";

export default function Coins({ navigation }) {

  const [allCoins, setAllCoins] = useState([])

    const getOwnedCoins = async () => {
              console.log("local coins are refreshing");

      const data = await CoinRepository.getAllCoins();
      if (data) {
        setAllCoins(data);
        console.log("local database: ", data)
      }
    }

    //always on rerender
  useFocusEffect(useCallback(() => {
    getOwnedCoins();
  }, []))


  const handleRefresh = async () => {
    await CoinRepository.populateDB();
    await getOwnedCoins();    
  }

  const handleReset = () => {
    CoinRepository.resetDB();
    getOwnedCoins();
  }

    const handleCheck = () => {
    CoinRepository.checkDB();
    getOwnedCoins();
  }


  return (
    <SafeAreaView>
      <Text variant="displayMedium">My Coins</Text>
      <View style={styles.row}>
              <Button 
        onPress={() => navigation.navigate('AddCoinScreen')}
        mode='contained'
        style={styles.button}
      >
        Add Coin
      </Button>
      <Button 
        onPress={handleRefresh}
        mode='contained'
        style={styles.button}

      >
        Refresh coins
      </Button>
      </View>
      <View style={styles.row}>
      <Button 
        onPress={handleReset}
        mode='contained'
        style={styles.button}
      >
        Reset db
      </Button>

  
      <Button 
        onPress={handleCheck}
        mode='contained'
        style={styles.button}

      >
        Check db
      </Button>
      </View>

      <FlatList 
        data={allCoins}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("AddCoinScreen", { coin: item })}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text variant="titleSmall" style={styles.title}>
                {item.country} - {item.name}: {item.year}
              </Text>
            </View>
              <Image
                source={{ uri: item.url }} 
                resizeMode="contain"
                style={item.amount === 0 ? styles.lockedImage : styles.image}
              />


            <Text variant="bodyMedium">Amount: {item.amount}</Text>
          </Pressable>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
    card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
    marginVertical: 20,
    borderRadius: 20,
  },
  image: {
    width: "150",
    height: "150",
    borderRadius: 75,
  },
  lockedImage: {
    width: "150",
    height: "150",
    borderRadius: 75,
    opacity: 0.3,
  },
  button: {
    width: "150",
    margin: 5,
  },
  row: {
    flexDirection: 'row',
  },


});
