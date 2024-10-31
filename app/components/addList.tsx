import React, { useState, useContext } from "react";
import AppContext from "../context/appContext";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import API from "../services/API";
import { useNavigation } from "@react-navigation/native";
import Colors from "@/constants/Colors";

export default function AddList() {
  const [nameList, setNameList] = useState("");
  const { family } = useContext(AppContext);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (nameList === "") {
      alert("Veuillez renseigner un nom de liste");
    } else {
      try {
        const list = {
          data: {
            name: nameList,
            calend_my: 1,
          },
        };
        const res = await API.addShoppingList(list);
        const newShoppingLists = [
          ...shoppingLists,
          {
            name: res.data.data.attributes.name,
            id: res.data.data.id,
            listItems: [],
          },
        ];
        updateShoppingLists(newShoppingLists);

        setNameList("");

        const listIndex =
          shoppingLists.length > 1
            ? (shoppingLists.length + 1).toString()
            : res.data.data.attributes.name;
        setTimeout(() => {
          navigation.navigate(listIndex);
        }, 200);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.bronze2,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontFamily: "BowlbyOne",
          color: Colors.bronze11,
          marginBottom: 20,
          marginTop: 60,
        }}
      >
        Ajouter une liste
      </Text>
      <TextInput
        style={{
          height: 80,
          width: "80%",
          borderColor: Colors.bronze5,
          borderRadius: 10,
          borderWidth: 1,
          marginBottom: 20,
          fontSize: 20,
          fontFamily: "AmaticBold",
          color: Colors.bronze11,
          padding: 10,
          backgroundColor: Colors.bronze5,
        }}
        value={nameList}
        placeholder="Nom de la liste"
        placeholderTextColor={Colors.bronze8}
        onChangeText={(text) => setNameList(text)}
      />
      <TouchableOpacity
        style={{
          backgroundColor: Colors.bronze9,
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          width: "60%",
          height: 70,
        }}
        onPress={() => handleSubmit()}
      >
        <AntDesign name="check" size={30} color={Colors.bronze12} />
        <Text style={{ color: Colors.bronze12 }}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}
