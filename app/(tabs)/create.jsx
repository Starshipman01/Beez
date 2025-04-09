import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapboxGL from "@rnmapbox/maps";
import { expressKeys } from "../../lib/expressKeys";
import { Keyboard } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useOrder } from "../../context/OrderContext";

const Create = () => {
  const [coordinates, setCoordinates] = useState([103.8198, 1.3521]); // Default to Singapore
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [zoomLevel, setZoomLevel] = useState(14); // Default zoom level
  const [isAddressSelected, setIsAddressSelected] = useState(false); // Flag to track address selection
  const { orderData, setOrderData } = useOrder();

  MapboxGL.setAccessToken(expressKeys.MAPBOX_PUBLIC_TOKEN);

  const [form, setForm] = useState({
    shop: "",
    orderCap: "",
    deliveryDate: null,
    orderCutOffDate: null,
    dropOffBlock: "",
    dropOffAddress: "",
    dropOffCoordinates: {
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    setForm(orderData);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3 || isAddressSelected) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce); // clear on cleanup
  }, [searchQuery, isAddressSelected]);

  // 🔹 Fetch Address Suggestions from Mapbox API
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${expressKeys.baseURL}/geocode?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  // 🔹 Handle Address Selection
  const handleSelectAddress = (location) => {
    const [lng, lat] = [
      location.properties.coordinates.longitude,
      location.properties.coordinates.latitude,
    ];
    const fullAddress = location.properties.full_address;

    setCoordinates([lng, lat]);
    setSelectedAddress(fullAddress);
    setForm((prevForm) => ({
      ...prevForm,
      dropOffCoordinates: {
        longitude: lng,
        latitude: lat,
      },
      dropOffAddress: fullAddress,
    }));
    setSearchQuery(fullAddress);
    setSuggestions([]);
    setIsAddressSelected(true);
    Keyboard.dismiss();
    setZoomLevel(16);
  };

  // 🔹 Confirm Location Selection
  const confirmLocation = () => {
    console.log("Button press: ", form);
    setOrderData(form);
    setTimeout(() => {
      router.push({
        pathname: "/createDelivery",
      });
    }, 50); // 50ms is enough, just gives React a breath
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
              setIsAddressSelected(false); // Reset flag when the user starts typing
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
                  {item.properties.full_address}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 🔹 Mapbox Map */}
        <View className="my-4 rounded-lg overflow-hidden">
          <MapboxGL.MapView style={{ height: 400, width: "100%" }}>
            <MapboxGL.Camera
              zoomLevel={zoomLevel}
              centerCoordinate={coordinates}
            />
            <MapboxGL.PointAnnotation
              id="unique-marker"
              coordinate={coordinates}
            >
              <View
                style={{
                  backgroundColor: "#3B82F6",
                  padding: 8,
                  borderRadius: 9999,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  📍
                </Text>
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
            Confirm Location PASSEDSHOP: {form.shop}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
