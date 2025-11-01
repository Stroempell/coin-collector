import { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import {
  TextInput,
  Text,
  Button,
  PaperProvider,
  Menu,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoinRepository } from "../../repository/CoinRepository";
import { Picker } from "@react-native-picker/picker";

export default function CoinInformation({ navigation, route }) {
  const existingCoin = route.params?.coin;

  const [newCoin, setNewCoin] = useState({
    id: existingCoin?.id || null,
    name: existingCoin?.name || "",
    country: existingCoin?.country || "",
    year: existingCoin?.year?.toString() || "",
    condition: existingCoin?.condition || "",
    amount: existingCoin?.amount?.toString() || 0,
    url: existingCoin?.url || "",
  });

  const HandleSave = async () => {
    if (newCoin.id) {
      await CoinRepository.updateCoin(newCoin);
    }

    navigation.goBack();
  };

  const HandleCancel = () => {
    navigation.goBack();
  };

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <SafeAreaView style={styles.container} edges={'top'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{ width: "100%" }} //otherwise scroll bar is in the center
      >
        <PaperProvider style={styles.container}>
          <Image
            source={{ uri: newCoin.url }}
            resizeMode="contain"
            style={[styles.image, styles.contentCenter]}
          />

          <TextInput
            label="Coin Name"
            value={newCoin.name}
            onChangeText={(text) => setNewCoin({ ...newCoin, name: text })}
            style={styles.textInputs}
            disabled
            multiline={true}
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

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Condition best coin</Text>
            <Picker
              style={[styles.picker, {}]}
              selectedValue={newCoin.condition}
              onValueChange={(itemValue) =>
                setNewCoin({ ...newCoin, condition: itemValue })
              }
            >
              {["Very good", "Good", "Average", "Bad", "Very bad"].map((c) => (
                <Picker.Item key={c} label={"  " + c} value={c} />
              ))}
            </Picker>
          </View>

          <View
            style={[styles.row, styles.contentCenter, { marginVertical: 5 }]}
          >
            <Button
              onPress={() => {
                const number = parseInt(newCoin.amount);
                if (number > 0) {
                  setNewCoin({ ...newCoin, amount: number - 1 });
                }
              }}
            >
              -
            </Button>
            <Text style={styles.number} variant="titleLarge">
              {newCoin.amount}
            </Text>
            <Button
              onPress={() => {
                const number = parseInt(newCoin.amount);
                setNewCoin({ ...newCoin, amount: number + 1 });
              }}
            >
              +
            </Button>
          </View>

          <Button
            mode="contained"
            label="Save"
            onPress={HandleSave}
            style={styles.button}
          >
            Save
          </Button>

          <Button
            mode="contained"
            label="Save"
            onPress={HandleCancel}
            style={styles.button}
          >
            Cancel
          </Button>
        </PaperProvider>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 20,
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentCenter: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  textInputs: {
    width: 250,
    marginVertical: 8,
  },
  picker: {
    //should be the same as react-native-paper textinput styling
    width: 250,
    height: 56,
    margin: 0,
    flexGrow: 1,
    paddingBottom: 0,
    paddingTop: 0,
    fontFamily: "sans-serif",
    letterSpacing: 0.15,
    fontSize: 16,
    color: "rgba(28, 27, 31, 1)",
    textAlignVertical: "top",
    textAlign: "left",
    minWidth: 95,
  },
  pickerLabel: {
    color: "rgba(69, 69, 69 , 1)",
    fontSize: 12,
    paddingLeft: 15,
    paddingTop: 15,
  },
  pickerContainer: {
    //should be the same as react-native-paper textinput styling
    backgroundColor: "rgba(231, 224, 236, 1)",
    paddingHorizontal: 0,
    marginVertical: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  number: {
    textAlign: "center",
  },
  image: {
    height: 150,
    borderRadius: 75,
  },
  button: {
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
  },
});
