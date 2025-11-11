import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Modal,
} from "react-native";
import { TextInput, Text, Button, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoinRepository } from "../../repository/CoinRepository";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";

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
    fetchUrl: existingCoin?.fetchUrl || "",
  });

  const [bigger, setBigger] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState(false);

  const HandleSave = async () => {
    if (newCoin.id) {
      await CoinRepository.updateCoin(newCoin);
    }

    navigation.goBack();
  };

  const HandleCancel = () => {
    navigation.goBack();
  };

  const openPopupPicture = () => {
    setModalVisible(true);
  };

  const openCamera = async () => {
    // request permission
    if (!cameraPermission) {
      const permissionResult = await requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert("You don't have permission to access the camera");
        return;
      } else {
        setCameraPermission(true);
      }
    }
    // launch camera
    const result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    setNewCoin({ ...newCoin, url: result.assets[0].uri });
    setModalVisible(false);
  };

  const openImages = async () => {
    // request permission
    if (!galleryPermission) {
      const permissionResult = await requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("You don't have permission to access your pictures");
        return;
      } else {
        setGalleryPermission(true);
      }
    }
    // launch camera
    const result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    setNewCoin({ ...newCoin, url: result.assets[0].uri });
    setModalVisible(false);
  };

  const alertDelete = () => {
    Alert.alert("Alert", "Are you sure you want to reset this picture?", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: async () => {
          await CoinRepository.resetCoinUrl(newCoin);
          setNewCoin((coin) => ({ ...coin, url: coin.fetchUrl }));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={"top"}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {/* pop-up like thingy */}
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Select Image Source</Text>

            <Button style={styles.option} onPress={openCamera}>
              <Text style={styles.optionText}>Take a picture</Text>
            </Button>

            <Button style={styles.option} onPress={openImages}>
              <Text style={styles.optionText}>Choose from gallery</Text>
            </Button>

            <Button
              style={styles.cancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Button>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{ width: "100%" }} //otherwise scroll bar is in the center
      >
        <PaperProvider style={styles.container}>
          <Pressable
            onPress={() => {
              setBigger(!bigger); //inverse of what it was
            }}
            style={[
              styles.contentCenter,
              styles.row,
              { alignItems: "flex-start" },
            ]}
          >
            <Image
              source={{ uri: newCoin.url }}
              resizeMode="cover"
              style={[
                styles.image,
                styles.contentCenter,
                bigger && styles.imagePressed,
              ]}
            />
            {!bigger && (
              <Ionicons
                name="resize-outline"
                size={20}
                style={{ marginStart: -20 }}
              />
            )}
            {bigger && (
              <Ionicons
                name="chevron-collapse-outline"
                size={20}
                style={{ marginStart: -30 }}
              />
            )}
          </Pressable>

          <View style={[styles.row, { justifyContent: "flex-end" }]}>
            <Pressable style={styles.icon} onPress={openPopupPicture}>
              <Ionicons name="camera" size={30} />
            </Pressable>
            <Pressable style={styles.icon} onPress={alertDelete}>
              <Ionicons name="trash-outline" size={30} />
            </Pressable>
          </View>

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
    width: 150,
    borderRadius: 75,
  },
  imagePressed: {
    height: 300,
    width: 300,
    borderRadius: 175,
  },
  button: {
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
  },
  icon: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    marginTop: -30,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  option: {
    backgroundColor: "rgba(103, 80, 164, 1)",
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    width: "100%",
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  cancel: {
    marginTop: 10,
    width: "100%",
  },
  cancelText: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    paddingVertical: 10,
  },
});
