import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import Colors from "@/constants/Colors";
import { TextInput } from "react-native-gesture-handler";
import API from "../services/API";

const settings = () => {
  const { family, updateFamily, userFamily, updateUserFamily } =
    useContext(AppContext);
  const [newFirstname, setNewFirstname] = useState("");
  const [newFamilyName, setNewFamilyName] = useState("");
  const [isFocusedUser, setIsFocusedUser] = useState(false);
  const [isFocusedFamily, setIsFocusedFamily] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (userFamily) {
      setNewFirstname(userFamily.firstname);
    }
  }, [userFamily]);

  useEffect(() => {
    if (family) {
      setNewFamilyName(family.name);
    }
  }, [family]);

  const handleSubmit = () => {
    if (userFamily) {
      API.updateUser(userFamily.documentId, {
        data: { firstname: newFirstname },
      })
        .then(() => {
          updateUserFamily({ ...userFamily, firstname: newFirstname });
          alert("Votre prénom a bien été modifié");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSubmitFamily = () => {
    if (family) {
      API.updateFamily(family.documentId, {
        data: { name: newFamilyName },
      })
        .then(() => {
          updateFamily({ ...family, name: newFamilyName });
          alert("Le nom de la famille a bien été modifié");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  if (userFamily && family) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bronze3,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("confirmAsker" as never)}
          style={{
            backgroundColor: Colors.bronze11,
            padding: 20,
            borderRadius: 5,
            margin: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "AmaticBold",
              fontSize: 26,
              color: "red",
              textAlign: "center",
            }}
          >
            Vous avez des membres à valider ici
          </Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.bronze6,
              padding: 20,
              borderRadius: 5,
              margin: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "AmaticBold",
                fontSize: 26,
                color: Colors.bronze11,
              }}
            >
              Changer votre prénom ici
            </Text>
            <TextInput
              style={{
                backgroundColor: Colors.bronze3,
                padding: 10,
                borderRadius: 5,
                margin: 10,
                color: Colors.bronze11,
              }}
              placeholderTextColor={Colors.bronze9}
              placeholder={!isFocusedUser ? userFamily.firstname : ""} // Placeholder disparaît au focus
              value={newFirstname} // Affiche la valeur de `newFirstname`
              onChangeText={(text) => setNewFirstname(text)} // Met à jour `newFirstname` sans effacer le texte
              onFocus={() => setIsFocusedUser(true)} // Masque le placeholder au focus
              onBlur={() => setIsFocusedUser(false)} // Réaffiche le placeholder à la perte de focus
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.bronze11,
                padding: 10,
                borderRadius: 5,
                margin: 10,
              }}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  fontFamily: "AmaticBold",
                  fontSize: 22,
                  color: Colors.bronze3,
                  textAlign: "center",
                }}
              >
                Valider
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: Colors.bronze6,
              padding: 20,
              borderRadius: 5,
              margin: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "AmaticBold",
                fontSize: 26,
                color: Colors.bronze11,
                textAlign: "center",
              }}
            >
              Changer le nom de la famille ici
            </Text>
            <TextInput
              style={{
                backgroundColor: Colors.bronze3,
                padding: 10,
                borderRadius: 5,
                margin: 10,
                color: Colors.bronze11,
              }}
              placeholderTextColor={Colors.bronze9}
              placeholder={!isFocusedFamily ? newFamilyName : ""} // Placeholder disparaît au focus
              value={newFamilyName} // Affiche la valeur de `newFirstname`
              onChangeText={(text) => setNewFamilyName(text)} // Met à jour `newFirstname` sans effacer le texte
              onFocus={() => setIsFocusedFamily(true)} // Masque le placeholder au focus
              onBlur={() => setIsFocusedFamily(false)} // Réaffiche le placeholder à la perte de focus
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.bronze11,
                padding: 10,
                borderRadius: 5,
                margin: 10,
              }}
              onPress={handleSubmitFamily}
            >
              <Text
                style={{
                  fontFamily: "AmaticBold",
                  fontSize: 22,
                  color: Colors.bronze3,
                  textAlign: "center",
                }}
              >
                Valider
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

export default settings;
