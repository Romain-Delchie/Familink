import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import API from "./services/API";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { useRouter, Redirect } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppContext from "./context/appContext";

const CreateFamily = () => {
  interface User {
    profile: string;
    // Add other properties of User if needed
  }

  const router = useRouter();
  const { family, updateUserFamily, updateFamily } = useContext(AppContext);
  const [userConnected, setUserConnected] = useState<User | null>(null);
  const { user } = useUser();
  const [isKnown, setIsKnown] = useState("waiting");
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [modalVisibleJoin, setModalVisibleJoin] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [joinFamilyId, setJoinFamilyId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Empêche le splash screen de disparaître automatiquement
    SplashScreen.preventAutoHideAsync();
  }, []);
  const [fontsLoaded] = useFonts({
    Amatic: require("../assets/fonts/AmaticSC-Regular.ttf"),
    AmaticBold: require("../assets/fonts/AmaticSC-Bold.ttf"),
    BowlbyOne: require("../assets/fonts/BowlbyOneSC-Regular.ttf"),
    Overlock: require("../assets/fonts/Overlock-Regular.ttf"),
  });

  useEffect(() => {
    if (user) {
      Promise.all([
        API.getOneFamilyByUser(user.emailAddresses[0].emailAddress),
        API.getUserByEmail(user.emailAddresses[0].emailAddress),
      ])
        .then(([familyRes, userRes]) => {
          console.log("Famille:", familyRes.data.data[0]);

          updateFamily(familyRes.data.data[0]);
          updateUserFamily(userRes.data.data[0]);
          setUserConnected(userRes.data.data[0]);
        })
        .catch((err) => {
          console.error("Erreur API:", err);
        });
    }
  }, [user]);

  useEffect(() => {
    if (userConnected !== null) {
      userConnected === undefined
        ? setIsKnown("no")
        : userConnected.profile !== "asker"
        ? setIsKnown("yes")
        : setIsKnown("asker");
    }
  }, [userConnected]);

  useEffect(() => {
    async function prepare() {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Garde le splash screen d'Expo visible jusqu'à ce que la police soit chargée
    return null;
  }
  const handleCreateFamily = async () => {
    try {
      // Crée l'utilisateur (s'il n'existe pas déjà)
      const userResponse = await API.createUser({
        data: {
          firstname: user?.firstName,
          lastname: user?.lastName,
          profile: "admin",
          email: user?.emailAddresses[0].emailAddress,
        },
      });

      // Crée la famille
      const familyResponse = await API.createFamily({
        data: { name: familyName },
      });

      const createdUser = userResponse.data.data;
      const createdFamily = familyResponse.data.data;

      // Met à jour la famille pour inclure l'utilisateur
      await API.updateFamily(createdFamily.documentId, {
        data: {
          user_list: [createdUser.documentId],
        },
      });

      // Met à jour l'utilisateur pour inclure la famille
      await API.updateUser(createdUser.documentId, {
        data: {
          family: [createdFamily.documentId],
        },
      }).then((res) => {
        updateUserFamily(res.data.data);
      });

      // Ferme la modal et réinitialise le champ
      setModalVisibleCreate(false);
      setFamilyName("");
      router.push("/(tabs)/home");
    } catch (error) {
      console.error(
        "Erreur lors de la création de la famille et de l'utilisateur:",
        error
      );
    }
  };

  const handleJoinFamily = async () => {
    // Logique pour rejoindre une famille

    try {
      // Crée l'utilisateur (s'il n'existe pas déjà)
      await API.createUser({
        data: {
          firstname: user?.firstName,
          lastname: user?.lastName,
          profile: "asker",
          email: user?.emailAddresses[0].emailAddress,
          family: [joinFamilyId],
        },
      });

      setModalVisibleJoin(false);
      setJoinFamilyId("");
      router.push("/notAcceptedYet");
    } catch (error) {
      //Afficher une erreur
      setErrorMessage("Cet identifiant de famille n'existe pas");
      console.error(error);
    }
  };

  if (isKnown === "waiting") {
    return (
      <View style={{ backgroundColor: Colors.bronze2, height: "100%" }}>
        <ActivityIndicator size="large" color={Colors.bronze10} />
      </View>
    );
  }

  if (isKnown === "no") {
    return (
      <View
        style={{
          backgroundColor: Colors.bronze1,
          height: "100%",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisibleCreate(true)}
        >
          <Text style={styles.buttonText}>Créer une famille</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.bronze12,
            textAlign: "center",
            fontSize: 20,
            margin: 40,
            fontFamily: "Overlock",
          }}
        >
          ou
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisibleJoin(true)}
        >
          <Text style={styles.buttonText}>Rejoindre une famille</Text>
        </TouchableOpacity>

        {/* Modal pour créer une famille */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleCreate}
          onRequestClose={() => setModalVisibleCreate(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Créer une famille</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la famille"
              value={familyName}
              onChangeText={setFamilyName}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                handleCreateFamily();
              }}
            >
              <Text style={styles.buttonText}>Créer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisibleCreate(false)}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Modal pour rejoindre une famille */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleJoin}
          onRequestClose={() => setModalVisibleJoin(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Rejoindre une famille</Text>
            <TextInput
              style={styles.input}
              placeholder="ID de la famille"
              value={joinFamilyId}
              onChangeText={setJoinFamilyId}
            />
            {/* Affichage du message d'erreur */}
            {errorMessage && (
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: -20,
                  marginBottom: 20,
                  fontSize: 10,
                }}
              >
                {errorMessage}
              </Text>
            )}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                handleJoinFamily();
              }}
            >
              <Text style={styles.buttonText}>Rejoindre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisibleJoin(false)}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  if (isKnown === "yes" && userConnected?.profile !== "admin") {
    return <Redirect href={"/(tabs)/home"} />;
  }

  if (isKnown === "yes" && userConnected?.profile === "admin") {
    if (
      family?.user_lists?.find(
        (user: { profile: string }) => user.profile === "asker"
      )
    ) {
      return <Redirect href={"/confirmAsker"} />;
    } else {
      return <Redirect href={"/(tabs)/home"} />;
    }
  }

  if (isKnown === "asker") {
    return <Redirect href={"/notAcceptedYet"} />;
  }
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.bronze9,
    width: "80%",
    height: 60,
    marginHorizontal: "auto",
    justifyContent: "center",
    borderRadius: 50,
    padding: 10,
  },
  buttonText: {
    color: Colors.bronze12,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "BowlbyOne",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "BowlbyOne",
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: "Overlock",
    width: "100%",
  },
  submitButton: {
    backgroundColor: Colors.bronze10,
    width: "80%",
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: Colors.bronze1,
    width: "80%",
    padding: 10,
    borderRadius: 50,
  },
});

export default CreateFamily;
