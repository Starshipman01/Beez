import React from "react";
import { View, Text } from "react-native";
import CustomButton from "./CustomButton"; // Ensure this is correctly imported
import { useRouter } from "expo-router"; // Use router from expo-router

export const AddressBar = ({
  title,
  onDropOffAddressChange,
  onDropOffCoordinatesChange,
  dropOffAddress,
}) => {

  const handlePress = () => {
    router.push("/create"); // Navigate to the Create page
  };

  return (
    <View className="space-y-2 mt-5">
      <Text className="text-base text-gray-100 font-pmedium first-letter text-left">
        {title}
      </Text>
      <View className="flex flex-row gap-4">
        <View className="flex-1 border-2 border-black-500 h-16 px-4 bg-black-100 rounded-2xl items-center justify-center">
          <Text className="text-white font-psemibold text-base">
            {dropOffAddress}
          </Text>
        </View>

        <CustomButton
          title="Drop Off "
          handlePress={handlePress} // Navigate on button press
          containerStyles="border-2 border-black-500 w-1/3 h-16 px-4 bg-black-100 rounded-2xl items-center flex-row"
        />
      </View>
    </View>
  );
};
