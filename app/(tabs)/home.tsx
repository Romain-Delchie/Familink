import { useFonts } from "expo-font";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import AppContext from "../context/appContext";
import { Feather } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import moment from "moment";
import "moment/locale/fr";

const home = () => {
  const { family } = useContext(AppContext);
  const today = moment().format("dddd Do MMMM YYYY");
  const todayDate = moment().format("YYYY-MM-DD");
  const { user } = useUser();
  const [handleRefresh, setHandleRefresh] = React.useState(false);

  const [loaded, error] = useFonts({
    Amatic: require("../../assets/fonts/AmaticSC-Regular.ttf"),
    AmaticBold: require("../../assets/fonts/AmaticSC-Bold.ttf"),
    BowlbyOne: require("../../assets/fonts/BowlbyOneSC-Regular.ttf"),
    Overlock: require("../../assets/fonts/Overlock-Regular.ttf"),
  });
  console.log(family?.shopping_lists);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error && !family) {
    return null;
  }

  if (!family) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 7,
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: user?.imageUrl }}
            style={{ width: 45, height: 45, borderRadius: 99, marginRight: 10 }}
          />
          <View>
            <Text style={{ color: Colors.bronze11, fontFamily: "BowlbyOne" }}>
              Hello 👋😊,
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.bronze11,
                fontFamily: "Overlock",
              }}
            >
              {user?.fullName}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setHandleRefresh((prev) => !prev);
          }}
        >
          <Feather name="refresh-ccw" size={24} color={Colors.bronze11} />
        </TouchableOpacity>
      </View>
      <View style={styles.family}>
        <Text
          style={{
            fontFamily: "BowlbyOne",
            fontSize: 26,
            color: Colors.bronze11,
          }}
        >
          {family.name}
        </Text>
      </View>
      <View style={styles.restContainer}>
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 24,
            textTransform: "capitalize",
            fontFamily: "AmaticBold",
            color: Colors.bronze12,
          }}
        >
          {today}
        </Text>

        <ScrollView contentContainerStyle={styles.eventContainer}>
          <View style={{ gap: 10 }}>
            {family.events.filter((event) => event.date === todayDate).length >
            0 ? (
              family.events
                .filter((event) => event.date === todayDate)
                .sort((a, b) => {
                  const timeA = new Date(`1970-01-01T${a.begin}`);
                  const timeB = new Date(`1970-01-01T${b.begin}`);
                  return timeA.getTime() - timeB.getTime();
                })
                .map((event, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        backgroundColor: Colors.bronze3,
                        borderRadius: 10,
                        gap: 10,
                        padding: 10,
                        shadowColor: Colors.bronze11,
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,
                        elevation: 4,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            marginBottom: 10,
                            color: Colors.bronze12,
                            fontFamily: "Overlock",
                          }}
                        >
                          {moment(event.begin, "HH:mm:ss.SSS").format("HH:mm")}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            marginBottom: 10,
                            color: Colors.bronze12,
                            fontFamily: "Overlock",
                          }}
                        >
                          {moment(event.end, "HH:mm:ss.SSS").format("HH:mm")}
                        </Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: Colors.bronze12,
                            fontFamily: "Overlock",
                          }}
                        >
                          {event.name}
                        </Text>
                        {event.instruction && (
                          <Text
                            style={{
                              fontSize: 13,
                              color: Colors.bronze11,
                              fontFamily: "Amatic",
                            }}
                          >
                            {event.instruction}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
            ) : (
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.bronze11,
                    fontFamily: "Amatic",
                  }}
                >
                  Aucun évènement prévu aujourd'hui
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.todoContainer}>
          {family.todo_items && family.todo_items.length > 0 ? (
            <View
              style={{
                backgroundColor: Colors.bronze5,
                width: "100%",
                padding: 15,
                borderRadius: 10,
                borderColor: Colors.bronze3,
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  textAlign: "center",
                  color: Colors.bronze12,
                  fontFamily: "Amatic",
                }}
              >
                Tâches prioritaires
              </Text>
              {family.todo_items
                .filter((item) => item.ranking === 0)
                .map((item, index) => {
                  return (
                    <Text
                      key={index}
                      style={{ fontSize: 16, color: Colors.bronze11 }}
                    >
                      {item.name}
                    </Text>
                  );
                })}
            </View>
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.bronze11,
                  fontFamily: "Overlock",
                }}
              >
                Aucune tâche prioritaire
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bronze2,
    paddingBottom: 60,
  },
  header: {
    display: "flex",
    backgroundColor: Colors.bronze3,
    flexDirection: "row",
    gap: 7,
    alignItems: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
  },
  family: {
    marginTop: 10,
    marginBottom: -20,
    flex: 1,
  },
  restContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10,
    flex: 6,
    marginTop: -40,
  },
  eventContainer: {
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  todoContainer: {
    backgroundColor: Colors.bronze5,
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
});
