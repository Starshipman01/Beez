import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[60px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text
        className={`text-primary font-psemibold text-lg ${textStyles}`}
        numberOfLines={1} // Ensure only one line
        adjustsFontSizeToFit={true} // Automatically adjusts font size to fit
        minimumFontScale={0.5}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
