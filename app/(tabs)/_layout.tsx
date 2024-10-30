import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";

export default function _layout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
