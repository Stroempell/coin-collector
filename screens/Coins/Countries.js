import { useCallback, useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Pressable } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoinRepository } from "../../repository/CoinRepository";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";

export default function Countries({ navigation }) {
  const [allCountries, setAllCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const getData = async () => {
    const coinAmounts = await CoinRepository.getCoinAmount();
    const countries = await CoinRepository.getAllCountries(searchQuery);

    let ownedCoins = 0;
    let maxCoins = 0;

    if (coinAmounts) {
      ownedCoins = coinAmounts[0].allOwnedCoins;
      maxCoins = coinAmounts[0].allMaxCoins;
    }
    //    console.log("countries are refreshing");

    if (countries) {
      setAllCountries([
        {
          id: 0,
          name: "EU (All)",
          owned_coins: ownedCoins,
          max_coins: maxCoins,
          url: "https://flagpedia.net/data/org/w1160/eu.webp",
        },
        ...countries,
      ]);
      //    console.log("local database: ", countries);
    }
  };

  //always on rerender
  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      handleRefresh(); // TODO check to see if this works
      getData();
    }, [])
  );

  useEffect(() => {
    getData();
  }, [searchQuery]);

  const handleRefresh = async () => {
    await CoinRepository.populateDB();
    await getData();
  };

  const handleCheck = () => {
    CoinRepository.checkDB();
    getData();
  };

  return (
    <SafeAreaView style={[styles.container]} edges={["top"]}>
      {/*
      <View style={styles.row}>
        <Button onPress={handleRefresh} mode="contained" style={styles.button}>
          Refresh
        </Button>
      </View>
      <View style={styles.row}>
        <Button onPress={handleCheck} mode="contained" style={styles.button}>
          Check db
        </Button>
      </View>
      */}
      <Text>Search for country</Text>
      <TextInput
        mode="outlined"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Belgium, Finland,..."
      />

      <FlatList
        data={allCountries}
        onRefresh={() => {
          try {
            setRefreshing(true);
            handleRefresh();
          } catch (e) {
            console.error(
              "Error happened while trying to fetch countries: ",
              e
            );
          } finally {
            setRefreshing(false);
          }
        }}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("Coins", { country: item.name })}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text variant="titleSmall" style={styles.title}>
                {item.name}: {item.owned_coins}/{item.max_coins}
              </Text>
            </View>
            <Image
              source={{ uri: item.url }}
              contentFit="fill"
              style={item.owned_coins === 0 ? styles.lockedImage : styles.image}
              cachePolicy={"disk"}
            />
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    margin: 10,
  },
  title: {
    textAlign: "center",
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 7,
    marginVertical: 20,
    borderRadius: 20,
  },
  image: {
    width: 150,
    height: 120,
    borderRadius: 150,
  },
  lockedImage: {
    width: 150,
    height: 120,
    borderRadius: 75,
    opacity: 0.3,
  },
  button: {
    width: 150,
    margin: 5,
  },
  row: {
    flexDirection: "row",
  },
});
