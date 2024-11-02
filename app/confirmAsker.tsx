import { StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import AppContext from "./context/appContext";
import { useUser } from "@clerk/clerk-react";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import API from "./services/API";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Redirect } from "expo-router";

interface Asker {
  documentId: string;
  firstname: string;
  email: string;
  profile: string;
}

const confirmAsker = () => {
  const { family, updateFamily } = useContext(AppContext);
  const { user } = useUser();
  const [askers, setAskers] = useState<Asker[]>([]);
  const [moove, setMoove] = useState(false);

  useEffect(() => {
    if (family) {
      setAskers(family.user_lists.filter((asker) => asker.profile === "asker"));
    }
  }, [family]);

  const handleConfirm = (asker: Asker) => {
    API.updateUser(asker.documentId, { data: { profile: "member" } })
      .then(() => {
        if (family) {
          updateFamily({
            ...family,
            user_lists: family.user_lists.map((user) => {
              if (user.documentId === asker.documentId) {
                return { ...user, profile: "member" };
              }
              return user;
            }),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (asker: Asker) => {
    API.deleteUser(asker.documentId)
      .then(() => {
        if (family) {
          updateFamily({
            ...family,
            user_lists: family.user_lists.filter(
              (user) => user.documentId !== asker.documentId
            ),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (moove) {
    return <Redirect href="/(tabs)/home" />;
  }

  if (family && user && askers && !moove) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.bronze2,
        }}
      >
        <Text
          style={{
            color: Colors.bronze11,
            marginTop: 100,
            fontFamily: "BowlbyOne",
            fontSize: 24,
          }}
        >
          Bonjour {user.firstName}{" "}
        </Text>
        <Text
          style={{
            color: Colors.bronze11,
            fontFamily: "AmaticBold",
            fontSize: 24,
            textAlign: "center",
          }}
        >
          Vous avez {askers.length} membre{askers.length > 1 ? "s" : ""} de
          votre famille à confirmer :
        </Text>
        <ScrollView style={{ width: "90%", margin: "auto" }}>
          {askers.map((asker, index) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: Colors.bronze3,
                  padding: 15,
                  borderRadius: 10,
                  width: "90%",
                  marginHorizontal: "auto",
                  marginVertical: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: Colors.bronze11,
                      fontFamily: "Amatic",
                      fontSize: 20,
                    }}
                  >
                    {asker.firstname}
                  </Text>
                  <Text
                    key={index}
                    style={{
                      color: Colors.bronze11,
                      fontFamily: "Amatic",
                      fontSize: 20,
                    }}
                  >
                    {asker.email}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                      handleConfirm(asker);
                    }}
                  >
                    <AntDesign
                      name="check"
                      size={28}
                      color="rgba(88, 254, 88, 0.8)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                      handleDelete(asker);
                    }}
                  >
                    <Entypo
                      name="cross"
                      size={30}
                      color="rgba(159, 73, 79, 1)"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          style={styles.btnHome}
          onPress={() => {
            setMoove(true);
          }}
        >
          <Text style={styles.btnText}>Aller sur l'appli</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default confirmAsker;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.bronze10,
    padding: 5,
    borderRadius: 50,
    marginTop: 10,
    fontSize: 12,
  },

  btnText: {
    color: Colors.bronze12,
    textAlign: "center",
    fontSize: 28,
    fontFamily: "AmaticBold",
  },
  btnHome: {
    backgroundColor: Colors.bronze10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 30,
    fontSize: 12,
    width: 300,
  },
});
