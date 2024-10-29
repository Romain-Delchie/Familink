import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

const notAcceptedYet = () => {
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
          fontSize: 18,
          width: "80%",
          marginHorizontal: "auto",
          fontFamily: "AmaticSC-Regular",
        }}
      >
        Votre famille n'a pas encore validé votre compte. Patientez encore un
        peu.
      </Text>
    </View>
  );
};

export default notAcceptedYet;
