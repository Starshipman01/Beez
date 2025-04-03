import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapboxGL from "@rnmapbox/maps";
import { expressKeys } from "../../lib/expressKeys";

const Create = () => {
  const [coordinates, setCoordinates] = useState([103.8198, 1.3521]); // Default to Singapore
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  MapboxGL.setAccessToken(expressKeys.MAPBOX_PUBLIC_TOKEN);

  // 🔹 Fetch Address Suggestions from Mapbox API
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${expressKeys.MAPBOX_PUBLIC_TOKEN}&country=SG`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  // 🔹 Handle Address Selection
  const handleSelectAddress = (location) => {
    const [lng, lat] = location.center;
    setCoordinates([lng, lat]);
    setSelectedAddress(location.place_name);
    setSuggestions([]);
    setSearchQuery(location.place_name);
  };

  // 🔹 Confirm Location Selection
  const confirmLocation = () => {
    alert(`Location confirmed: ${selectedAddress || "Custom location"}`);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Map Selection
        </Text>

        {/* 🔹 Search Bar */}
        <View className="mt-4 mb-2">
          <TextInput
            className="bg-white p-3 rounded-lg text-black"
            placeholder="Search for an address..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchSuggestions(text);
            }}
          />
        </View>

        {/* 🔹 Address Suggestions */}
        {suggestions.length > 0 && (
          <View className="bg-white p-2 rounded-lg">
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectAddress(item)}
              >
                <Text className="text-black p-2 border-b">
                  {item.place_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 🔹 Mapbox Map */}
        <View className="h-[400px] w-full my-4 rounded-lg overflow-hidden">
          <MapboxGL.MapView style={{ flex: 1 }}>
            <MapboxGL.Camera zoomLevel={12} centerCoordinate={coordinates} />
            <MapboxGL.PointAnnotation
              id="unique-marker"
              coordinate={coordinates}
            >
              <View className="bg-blue-500 p-2 rounded-full">
                <Text className="text-white font-bold">📍</Text>
              </View>
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
        </View>

        {/* 🔹 Confirm Button */}
        <TouchableOpacity
          onPress={confirmLocation}
          className="bg-blue-500 p-4 rounded-lg mt-4"
        >
          <Text className="text-white text-center font-bold">
            Confirm Location
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
