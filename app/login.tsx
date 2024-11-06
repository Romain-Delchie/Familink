import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Colors from "@/constants/Colors";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useClerk, useOAuth } from "@clerk/clerk-expo";

export default function login() {
  useWarmUpBrowser();
  const [fontsLoaded] = useFonts({
    Amatic: require("../assets/fonts/AmaticSC-Regular.ttf"),
    AmaticBold: require("../assets/fonts/AmaticSC-Bold.ttf"),
    BowlbyOne: require("../assets/fonts/BowlbyOneSC-Regular.ttf"),
    Overlock: require("../assets/fonts/Overlock-Regular.ttf"),
  });
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { signOut } = useClerk();

  const onPress = React.useCallback(async () => {
    try {
      signOut();
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("createFamily", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
        console.log("OAuth flow completed without creating a session");
      }
    } catch (err) {
      console.error("OAuth error", err);
      console.log("Error details:", JSON.stringify(err, null, 2));
    }
  }, []);
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
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.bronze2,
        }}
      >
        <ActivityIndicator size="large" color={Colors.bronze8} />
      </View>
    );
  }

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: Colors.bronze1,
      }}
    >
      <Image
        source={require("./../assets/images/family.jpg")}
        style={{ width: "100%", height: 600 }}
      />
      <View
        style={{
          padding: 25,
          marginTop: -20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: Colors.bronze1,
        }}
      >
        <Text
          style={{
            marginTop: 20,
            fontSize: 30,
            textAlign: "center",
            color: Colors.bronze11,
            fontFamily: "Amatic",
          }}
        >
          Welcome to Familink
        </Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={onPress}>
          <Text
            style={{
              color: Colors.bronze12,
              textAlign: "center",
              padding: 10,
              borderRadius: 50,
              fontSize: 17,
              fontFamily: "BowlbyOne",
              backgroundColor: Colors.bronze10,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            color: Colors.bronze11,
            fontFamily: "Overlock",
          }}
        >
          By continuing you agree to ours terms and conditions
        </Text>
      </View>
    </View>
  );
}

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();
