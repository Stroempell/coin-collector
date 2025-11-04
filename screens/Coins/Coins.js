import { useCallback, useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Image, Pressable } from "react-native";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoinRepository, initializeDB } from "../../repository/CoinRepository";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";

export default function Coins({ navigation, route }) {
  const country = route.params?.country;

  const [allCoins, setAllCoins] = useState([]);
  const [sorting, setSorting] = useState("ASC");
  const [allYears, setAllYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  const getOwnedCoins = async () => {
    //  console.log("local coins are refreshing");

    let data;
    if (country == "EU (All)") {
      data = await CoinRepository.getAllCoins(sorting, selectedYears);
    } else {
      //    console.log("fetching data for country ", country);
      data = await CoinRepository.getCoinsByCountry(
        country,
        sorting,
        selectedYears
      );
    }
    if (data) {
      setAllCoins(data);
      //     console.log("local database: ", data);
    }
  };

  const getYears = async () => {
    const data = await CoinRepository.getAllYears(); //returns array
    const formatted = data.map((year) => ({
      //necessary for multiselect
      id: year,
      name: year.toString(),
    }));
 //   console.log("All years: ", formatted);
    setAllYears(formatted);
  };

  //always on rerender
  useFocusEffect(
    useCallback(() => {
      getOwnedCoins();
      getYears();
    }, [])
  );

  useEffect(
    useCallback(() => {
      getOwnedCoins(sorting, selectedYears);
    }, [sorting, selectedYears]) //constantly checks if sorting changes
  );

  const handleRefresh = async () => {
    await CoinRepository.populateDB();
    await getOwnedCoins();
  };

  const handleInit = () => {
    //  initializeDB();
    getOwnedCoins();
  };

  const handleReset = () => {
    CoinRepository.resetDB();
    getOwnedCoins();
  };

  const handleCheck = () => {
    CoinRepository.checkDB();
    getOwnedCoins();
  };

  return (
    <SafeAreaView style={[styles.container]} edges={["top"]}>
      <Text variant="displayMedium" style={styles.title}>
        {country}
      </Text>
      {/*
      <View style={styles.row}>
        <Button onPress={handleRefresh} mode="contained" style={styles.button}>
          Refresh coins
        </Button>
        <Button onPress={getYears} mode="contained" style={styles.button}>
          Get years
        </Button>
      </View>
      <View style={styles.row}>
        <Button onPress={handleReset} mode="contained" style={styles.button}>
          Reset db
        </Button>

        <Button onPress={handleCheck} mode="contained" style={styles.button}>
          Check db
        </Button>
      </View>
*/}

      <FlatList
        data={allCoins}
        ListHeaderComponent={
          <View
            style={{
              width: "100%",
              backgroundColor: "#dfd3e3",
              borderRadius: 20,
              padding: 15,
              marginHorizontal: 10,
              marginBottom: 10,
            }}
          >
            {/* sorting part */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Sort by year
              </Text>
              <View
                style={{ borderRadius: 10, overflow: "hidden", width: "90%" }}
              >
                <Picker
                  selectedValue={sorting}
                  style={{
                    height: 55,
                    width: "100%",
                    backgroundColor: "#fff",
                    borderRadius: 10,
                  }}
                  onValueChange={(value) => setSorting(value)}
                >
                  <Picker.Item label="Old to new" value="ASC" />
                  <Picker.Item label="New to old" value="DESC" />
                </Picker>
              </View>
            </View>

            {/* filter part */}
            <View>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Filter by year
              </Text>
              <MultiSelect
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: "#fff",
                  width: "90%",
                }}
                data={allYears}
                labelField="name"
                valueField="id"
                placeholder="Select years"
                search
                value={selectedYears}
                onChange={setSelectedYears}
                selectedStyle={{
                  backgroundColor: "#cbb4d4",
                  borderRadius: 12,
                  marginTop: 5,
                }}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("Coin information", { coin: item })
            }
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text variant="titleSmall" style={styles.title}>
                {item.year}: {item.country_name}
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
    flexDirection: "row",
  },
});
