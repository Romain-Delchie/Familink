import { View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import AppContext from "../context/appContext";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ListItem from "../components/listItem";
import AddList from "../components/addList";
import Colors from "@/constants/Colors";

export default function Lists() {
  const Tab = createMaterialTopTabNavigator();
  const { family } = useContext(AppContext);

  const styles = StyleSheet.create({
    containerList: {
      backgroundColor: Colors.bronze2,
      flexDirection: "row",
      paddingTop: 50,
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexGrow: 1,
    },

    buttonList: {
      backgroundColor: Colors.bronze10,
      padding: 10,
      width: 100,
      height: 60,
      borderRadius: 5,
      justifyContent: "center",
    },
    listName: {
      textAlign: "center",
      color: Colors.bronze11,
    },
  });

  if (!family) return <Text>Chargement...</Text>;

  return (
    <View style={styles.containerList}>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: Colors.bronze11,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "BowlbyOne",
          },
          tabBarStyle: {
            backgroundColor: Colors.bronze5,
          },
          tabBarActiveTintColor: Colors.bronze12,
          tabBarInactiveTintColor: Colors.bronze11,
        }}
      >
        {family &&
          family.shopping_lists.map((list, index) => {
            return (
              <Tab.Screen
                name={
                  family.shopping_lists.length > 2
                    ? (index + 1).toString()
                    : list.name
                }
                key={index}
                children={() => (
                  <ListItem
                    list={
                      list as {
                        documentId: string;
                        name: string;
                        id: number;
                        list_items: {
                          documentId: string;
                          name: string;
                          quantity?: string;
                          author: string;
                          id: number;
                        }[];
                      }
                    }
                  />
                )}
              />
            );
          })}
        <Tab.Screen
          name={family.shopping_lists.length > 2 ? "+" : "Ajouter liste"}
          component={AddList}
        />
      </Tab.Navigator>
    </View>
  );
}
