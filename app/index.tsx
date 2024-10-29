import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
  const { user } = useUser();

  return (
    <View>
      <Redirect href={"/notAcceptedYet"} />
      {/* <Redirect href={"/createFamily"} /> */}
      {/* <Redirect href={"/login"} /> */
      /* <View>
        {!user ? (
          <Redirect href={"/login"} />
        ) : (
          <Redirect href={"/createFamily"} />
        )}
      </View> */}
    </View>
  );
}
