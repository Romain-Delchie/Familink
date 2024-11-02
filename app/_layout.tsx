import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import AppProvider from "./context/appProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkLoaded>
        <AppProvider>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen
                name="createFamily"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="notAcceptedYet" />
              <Stack.Screen
                name="confirmAsker"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
        </AppProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
