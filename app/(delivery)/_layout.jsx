import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const DeliveryLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="deliveryLanding" options={{ headerShown: false }} />
        <Stack.Screen name="mapSelect" options={{ headerShown: false }} />
        <Stack.Screen name="mapRequest" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default DeliveryLayout;
