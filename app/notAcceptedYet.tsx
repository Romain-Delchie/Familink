import { View, Text, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import Colors from "@/constants/Colors";

const notAcceptedYet = () => {
  const [loaded, error] = useFonts({
    Amatic: require("../assets/fonts/AmaticSC-Regular.ttf"),
    BowlbyOne: require("../assets/fonts/BowlbyOneSC-Regular.ttf"),
    Overlock: require("../assets/fonts/Overlock-Regular.ttf"),
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
    <View
      style={{
        backgroundColor: Colors.bronze1,
        height: "100%",
        justifyContent: "space-evenly",
      }}
    >
      <Image
        source={require("./../assets/images/family.jpg")}
        style={{
          width: "80%",
          marginHorizontal: "auto",
          height: 400,
          borderRadius: 20,
        }}
      />
      <Text
        style={{
          color: Colors.bronze12,
          textAlign: "center",
          fontSize: 30,
          width: "80%",
          marginHorizontal: "auto",
          fontFamily: "Amatic",
        }}
      >
        Votre famille n'a pas encore validé votre compte. Patientez encore un
        peu.
      </Text>
    </View>
  );
};

export default notAcceptedYet;
