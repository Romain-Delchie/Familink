import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native"; // Importez ActivityIndicator pour l'indicateur de chargement
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

// Empêche la dissimulation automatique de l'écran de splash
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { user, isLoaded } = useUser(); // Récupère l'utilisateur et son état de chargement
  const [appIsReady, setAppIsReady] = useState(false); // État pour indiquer si l'application est prête

  useEffect(() => {
    // Vérifiez si l'utilisateur est chargé
    if (isLoaded) {
      // Si l'utilisateur est chargé, indiquez que l'application est prête
      setAppIsReady(true);
      // Cachez l'écran de splash
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  // Affichez un indicateur de chargement pendant que l'utilisateur est chargé
  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        {/* Un indicateur de chargement */}
      </View>
    );
  }

  // Effectuer la redirection
  return (
    <View>
      {!user ? <Redirect href="/login" /> : <Redirect href="/createFamily" />}
    </View>
  );
}
