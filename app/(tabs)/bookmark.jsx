import { View, Text } from "react-native";
import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Bookmark = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView>
      <View>
        <Text>Bookmark</Text>
      </View>
    </SafeAreaView>
  );
};

export default Bookmark;
