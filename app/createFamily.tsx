import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import API from "./services/API";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { useRouter, Redirect } from "expo-router";

const CreateFamily = () => {
  interface Family {
    Name: string;
    documentId: string;
  }
  const router = useRouter();
  const [families, setFamilies] = useState<Family[] | null>(null);
  const [users, setUsers] = useState<any[] | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [isKnown, setIsKnown] = useState("waiting");

  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [modalVisibleJoin, setModalVisibleJoin] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [joinFamilyId, setJoinFamilyId] = useState("");
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    Promise.all([API.getFamilies(), API.getUsers()])
      .then(([familiesRes, usersRes]) => {
        setFamilies(familiesRes.data.data); // Traitement des données des familles
        setUsers(usersRes.data.data); // Traitement des données des utilisateurs
      })
      .catch((err) => {
        console.error("Erreur API:", err);
      });
  }, []);

  useEffect(() => {
    families &&
      user &&
      users &&
      users.map((oneUser) => {
        if (oneUser.email === user.emailAddresses[0].emailAddress) {
          oneUser.profile !== "asker" ? setIsKnown("yes") : setIsKnown("asker");
        }
      });
    if (isKnown === "waiting") {
      setIsKnown("no");
    }
  }, [families, users, user]);

  const handleCreateFamily = async () => {
    try {
      // Crée l'utilisateur (s'il n'existe pas déjà)
      const userResponse = await API.createUser({
        data: {
          firstname: user.firstName,
          lastname: user.lastName,
          profil: "admin",
          email: user.emailAddresses[0].emailAddress,
        },
      });
      console.log("userResponse", userResponse);

      // Crée la famille
      const familyResponse = await API.createFamily({
        data: { name: familyName },
      });

      const createdUser = userResponse.data.data;
      const createdFamily = familyResponse.data.data;
      console.log(createdUser);
      console.log(createdFamily);

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
      });

      // Ferme la modal et réinitialise le champ
      setModalVisibleCreate(false);
      setFamilyName("");
      router.push("/(tab)/home");
    } catch (error) {
      console.error(
        "Erreur lors de la création de la famille et de l'utilisateur:",
        error
      );
    }
  };

  // render

  if (isKnown === "waiting") {
    return (
      <ActivityIndicator
        style={{ margin: "auto" }}
        size={50}
        color={Colors.bronze11}
      />
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
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                console.log("Rejoindre la famille avec ID :", joinFamilyId);
                // Logique pour rejoindre la famille
                setModalVisibleJoin(false);
                setJoinFamilyId(""); // Réinitialiser le champ
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

  if (isKnown === "yes") {
    return <Redirect href={"/(tab)/home"} />;
  }

  if (isKnown === "asker") {
    return <Redirect href={"/notAcceptadeYet"} />;
  }
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.bronze10,
    width: "80%",
    height: 60,
    marginHorizontal: "auto",
    borderRadius: 50,
    padding: 10,
  },
  buttonText: {
    color: Colors.bronze12,
    textAlign: "center",
    fontSize: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
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
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
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
