import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
  const { user } = useUser();

  return (
    <View>{!user ? <Redirect href={"/login"} /> : <Text>Welcome </Text>}</View>
  );
}
