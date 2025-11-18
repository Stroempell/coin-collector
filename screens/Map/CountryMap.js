import { StyleSheet } from "react-native";
import MapView, { UrlTile } from "react-native-maps";
import { Text } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import EuropeMap from "./EuropeMap";
import SvgPanZoomimport, { SvgPanZoomElement } from "react-native-svg-pan-zoom";
import SvgPanZoom from "react-native-svg-pan-zoom";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { mapCountryNamesToCodes } from "../../utils/MapCountryNames";
import { CoinRepository } from "../../repository/CoinRepository";

export default function CountryMap() {
  const [countryPercentages, setCountryPercentages] = useState({});

  const getData = async () => {
    const rows = await CoinRepository.getPercentageCountries();
    setCountryPercentages(rows);
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <SvgPanZoom
        canvasWidth={519}
        canvasHeight={558}
        minScale={0.7}
        maxScale={2.0}
        initialZoom={1.0}
      >
        <EuropeMap countryPercentages={countryPercentages} />
      </SvgPanZoom>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
