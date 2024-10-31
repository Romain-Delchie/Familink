import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import TabBar from "../components/tabBar";

export default function _layout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="calendar" options={{ headerShown: false }} />
      <Tabs.Screen name="shopping" options={{ headerShown: false }} />
      <Tabs.Screen name="todo" options={{ headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
