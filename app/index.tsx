import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
  const { user } = useUser();

  return (
    <View>
      <Redirect href={"/login"} />
    </View>
    // <View>{!user ? <Redirect href={"/login"} /> : <Text>Welcome </Text>}</View>
  );
}
