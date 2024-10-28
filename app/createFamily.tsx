import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import API from "./services/API";
import { useUser } from "@clerk/clerk-expo";

const createFamily = () => {
  interface Family {
    Name: string;
    documentId: string;
  }

  const [families, setFamilies] = useState<Family[] | null>(null);
  const [users, setUsers] = useState<any[] | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [isKnown, setIsKnown] = useState(false);

  useEffect(() => {
    Promise.all([API.getFamilies(), API.getUsers()])
      .then(([familiesRes, usersRes]) => {
        setFamilies(familiesRes.data.data); // Traitement des données des familles
        setUsers(usersRes.data.data); // Traitement des données des utilisateurs
      })
      .catch((err) => {
        console.error("Erreur API:", err);
      });
  }, []);

  useEffect(() => {
    families &&
      user &&
      users &&
      users.map((oneUser) => {
        if (oneUser.email === user.emailAddresses[0].emailAddress) {
          setIsKnown(true);
        }
      });
    // console.log(families);
    // console.log(users);
    // console.log(user);
  }, [families, users, user]);

  if (!isLoaded) {
    return <Text>Loading user...</Text>;
  }

  if (!isKnown) {
    return <Text>Vous n'êtes pas enregistré dans la base de données</Text>;
  }

  return (
    <View>
      {families && users && user ? (
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
