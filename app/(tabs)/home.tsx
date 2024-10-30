import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import AppContext from "../context/appContext";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const home = () => {
  const { userFamily } = useContext(AppContext);
  const { user } = useUser();
  const [handleRefresh, setHandleRefresh] = React.useState(false);

  const [loaded, error] = useFonts({
    Amatic: require("../../assets/fonts/AmaticSC-Regular.ttf"),
    BowlbyOne: require("../../assets/fonts/BowlbyOneSC-Regular.ttf"),
    Overlock: require("../../assets/fonts/Overlock-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
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
                fontWeight: 700,
                color: Colors.bronze11,
                fontFamily: "BowlbyOne",
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
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bronze1,
  },
  header: {
    display: "flex",
    backgroundColor: Colors.bronze3,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    position: "absolute",
    top: 0,
    paddingTop: 20,
    justifyContent: "space-between",
    width: "100%",
  },
});
