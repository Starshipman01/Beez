import React, { useState } from "react";
import { View, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomButton from "./CustomButton"; // Ensure this is correctly imported

export const DatetimeBar = ({ onDateChange, title }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date); // Send the selected date to the parent component
    }
    hideDatePicker();
  };

  return (
    <View className="space-y-2 mt-5">
      <Text className="text-base text-gray-100 font-pmedium first-letter text-left">
        {title}
      </Text>
      <View className="flex flex-row gap-4 justify-between">
        {/* Date Text Box */}
        <View className="flex-1 border-2 border-black-500 h-16 px-4 bg-black-100 rounded-2xl items-center justify-center">
          <Text className="text-white font-psemibold text-base">
            {selectedDate.toLocaleDateString()}
          </Text>
        </View>

        {/* Time Text Box */}
        <View className="flex-1 border-2 border-black-500 h-16 px-4 bg-black-100 rounded-2xl items-center justify-center">
          <Text className="text-white font-psemibold text-base">
            {selectedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>

        {/* Custom Button for Selecting Time */}
        <CustomButton
          title="Select Time"
          handlePress={showDatePicker}
          containerStyles="border-2 border-black-500 w-1/3 h-16 px-4 bg-black-100 rounded-2xl items-center justify-center"
        />
      </View>

      {/* DateTime Picker Modal */}
      <DateTimePickerModal
        date={selectedDate}
        isVisible={datePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};
