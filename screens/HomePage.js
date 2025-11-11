import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoinRepository } from "../repository/CoinRepository";
import { ScrollView } from "react-native";

export default function HomePage() {
  const [maxCoins, setMaxCoins] = useState(0);
  const [ownedCoins, setOwnedCoins] = useState(0);
  const [maxCountries, setMaxCountries] = useState(0);
  const [ownedCountries, setOwnedCountries] = useState(0);
  const [topCountries, setTopCountries] = useState([]);
  const [bestPercentageCountry, setBestPercentageCountry] = useState({
    name: "Country1",
    percentage: 0
  });
  const [worstPercentageCountry, setWorstPercentageCountry] = useState({
    name: "Country2",
    percentage: 0
  });

  const getData = async () => {
    let coinAmounts;
    let countryAmounts;
    let topCountryAmounts;
    let percentageCountries;

    try {
      coinAmounts = await CoinRepository.getCoinAmount();
    } catch (e) {
      console.log("Error with coinAmount: ", e);
    }

    try {
      countryAmounts = await CoinRepository.getCountryAmounts();
    } catch (e) {
      console.log("Error with country amounts: ", e);
    }

    try {
      topCountryAmounts = await CoinRepository.getTopCountryAmounts();
    } catch (e) {
      console.log("Error with top country amounts: ", e);
    }

    try {
      percentageCountries = await CoinRepository.getPercentageCountries();
    } catch (e) {
      console.log("Error with percentage amounts: ", e);
    }

    if (coinAmounts) {
      setOwnedCoins(coinAmounts[0].allOwnedCoins);
      setMaxCoins(coinAmounts[0].allMaxCoins);
    }

    if (countryAmounts) {
      setOwnedCountries(countryAmounts[0].allOwnedCountries);
      setMaxCountries(countryAmounts[0].allMaxCountries);
    }

    if (topCountryAmounts) {
      setTopCountries(topCountryAmounts);
    }

    if (percentageCountries) {
      setBestPercentageCountry(percentageCountries[0]);
      setWorstPercentageCountry(
        percentageCountries[percentageCountries.length - 1]
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return (
    <SafeAreaView
      style={[styles.container, { paddingHorizontal: 0 }]}
      edges={"top"}
    >
      <ScrollView
        style={{
          width: "100%",
          marginBottom: 0,
          paddingBottom: 0,
          paddingHorizontal: 30,
        }} //otherwise scroll bar is in the center
      >
        <View style={[styles.cell, styles.bg_light_purple, { margin: 0 }]}>
          <Text style={styles.color_dark_gray} variant="displayMedium">
            Coin overview
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, styles.bg_purple, { flex: 2 }]}>
            <Text style={styles.color_light_gray} variant="titleMedium">
              {ownedCoins}/{maxCoins} coins
            </Text>
          </View>
          <Text variant="titleMedium" style={{ flex: 1 }}>
            IN
          </Text>
          <View style={[styles.cell, styles.bg_dark_blue, { flex: 3 }]}>
            <Text style={styles.color_light_gray} variant="titleMedium">
              {ownedCountries}/{maxCountries} countries
            </Text>
          </View>
        </View>

        <View style={[styles.cell, styles.bg_light_blue, { width: "100%" }]}>
          <Text style={styles.color_light_gray} variant="titleMedium">
            Most coins per countries:
          </Text>
          {topCountries.map((c, i) => (
            <Text
              key={i}
              style={[styles.color_light_gray, styles.ms_20]}
              variant="titleSmall"
            >
              • {c.name}: {c.ownedCoins}
            </Text>
          ))}
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, styles.bg_blue, { flex: 2 }]}>
            <Text style={styles.color_light_gray} variant="titleMedium">
              Most collected per country:
            </Text>
            {bestPercentageCountry && (
              <Text style={styles.color_light_gray} variant="titleMedium">
                {bestPercentageCountry.name}:{" "}
                {(bestPercentageCountry.percentage * 100).toFixed(2)}%
              </Text>
            )}
          </View>
          <View style={[styles.cell, styles.bg_purple, { flex: 2 }]}>
            <Text style={styles.color_light_gray} variant="titleMedium">
              Least collected per country:
            </Text>
            {worstPercentageCountry && (
              <Text style={styles.color_light_gray} variant="titleMedium">
                {worstPercentageCountry.name}:{" "}
                {(worstPercentageCountry.percentage * 100).toFixed(2)}%
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 30,
    paddingBottom: 0,
    marginBottom: 0,
  },
  cell: {
    padding: 20,
    borderRadius: 25,
    marginBottom: 30,
    margin: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  ms_20: {
    marginStart: 20,
  },
  me_5: {
    marginEnd: 5,
  },
  bg_purple: {
    backgroundColor: "rgba(103, 80, 164, 1)",
  },
  bg_light_purple: {
    backgroundColor: "#dfd3e3",
  },
  bg_dark_blue: {
    backgroundColor: "#2e0985ff",
  },
  bg_light_blue: {
    backgroundColor: "#4897ccff",
  },
  bg_blue: {
    backgroundColor: "#4753c7ff",
  },

  color_dark_gray: {
    color: "#3e4242ff",
  },
  color_light_gray: {
    color: "#e9e1e9ff",
  },
});
