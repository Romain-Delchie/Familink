import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import API from "./services/API";
import { useUser } from "@clerk/clerk-expo";

const createFamily = () => {
  interface Family {
    Name: string;
  }

  const [families, setFamilies] = useState<Family[] | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    API.getFamilies()
      .then((res) => setFamilies(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    families && families;
  }, [families]);

  if (!isLoaded) {
    return <Text>Loading user...</Text>;
  }

  return (
    <View>
      {families ? (
        <Text>Votre famille : {families[0].Name}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
      {isSignedIn ? (
        <Text>Vous êtes connecté {user.emailAddresses[0].emailAddress}</Text>
      ) : (
        <Text>Vous n'êtes pas connecté</Text>
      )}
    </View>
  );
};

export default createFamily;
