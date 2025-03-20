import { useState } from "react";
import { View, Text } from "react-native";
import WheelPickerExpo, { Picker } from "react-native-wheel-picker-expo";

const DateTimePicker = ({ onDateTimeChange }) => {
  // Generate options for date picker (Next 7 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date.toDateString()); // "Wed Mar 20 2025"
    }
    return dates;
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];
  const ampm = ["AM", "PM"];

  const [selectedDate, setSelectedDate] = useState(generateDates()[0]);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  // Function to pass selected date-time to parent component
  const handleDateTimeChange = () => {
    if (onDateTimeChange) {
      onDateTimeChange(`${selectedDate}, ${hour}:${minute} ${period}`);
    }
  };

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-semibold text-center mb-2">
        Select Date & Time
      </Text>

      <WheelPickerExpo
        items={generateDates()}
        onChange={(val) => {
          setSelectedDate(val);
          handleDateTimeChange();
        }}
        value={selectedDate}
      />

      <View className="flex flex-row gap-4 justify-center mt-4">
        {/* Hour Picker */}
        <WheelPickerExpo
          items={hours}
          onChange={(val) => {
            setHour(val);
            handleDateTimeChange();
          }}
          value={hour}
        />
        {/* Minute Picker */}
        <WheelPickerExpo
          items={minutes}
          onChange={(val) => {
            setMinute(val);
            handleDateTimeChange();
          }}
          value={minute}
        />
        {/* AM/PM Picker */}
        <WheelPickerExpo
          items={ampm}
          onChange={(val) => {
            setPeriod(val);
            handleDateTimeChange();
          }}
          value={period}
        />
      </View>

      <Text className="text-center text-gray-700 mt-4">
        Selected: {selectedDate}, {hour}:{minute} {period}
      </Text>
    </View>
  );
};

export default DateTimePicker;
