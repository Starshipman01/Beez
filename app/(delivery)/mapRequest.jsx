import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapboxGL from "@rnmapbox/maps";
import { expressKeys } from "../../lib/expressKeys";
import { Keyboard } from "react-native";
import { router } from "expo-router";
import { useRequest } from "../../context/RequestContext";

const MapSelect = () => {
  const [coordinates, setCoordinates] = useState([103.8198, 1.3521]); // Default to Singapore
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [zoomLevel, setZoomLevel] = useState(14); // Default zoom level
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const { requestData, setRequestData } = useRequest();

  const [form, setForm] = useState({
    dropOffAddress: "",
    dropOffCoordinates: {
      latitude: 0,
      longitude: 0,
    },
    dropOffRange: 0,
  });

  MapboxGL.setAccessToken(expressKeys.MAPBOX_PUBLIC_TOKEN);

  useEffect(() => {
    setForm(requestData);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3 || isAddressSelected) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, isAddressSelected]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `${expressKeys.baseURL}/geocode?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleSelectAddress = (location) => {
    const [lng, lat] = [
      location.properties.coordinates.longitude,
      location.properties.coordinates.latitude,
    ];
    const fullAddress = location.properties.full_address;

    setCoordinates([lng, lat]);
    setSelectedAddress(fullAddress);
    setForm((prev) => ({
      ...prev,
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

  const confirmLocation = () => {
    const updatedForm = form;
    setRequestData(updatedForm);
    console.log("LATEST FORM in mapREQ: ", updatedForm);
    alert(`Location confirmed: ${selectedAddress || "Custom location"}`);
    setTimeout(() => {
      router.push("/submitRequest");
    }, 50);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Map Selection
        </Text>

        {/* Search Bar */}
        <View className="mt-4 mb-2">
          <TextInput
            className="bg-white p-3 rounded-lg text-black"
            placeholder="Search for an address..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setIsAddressSelected(false);
            }}
          />
        </View>

        {/* Address Suggestions */}
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

        {/* Mapbox Map */}
        <View className="my-4 rounded-lg overflow-hidden">
          <MapboxGL.MapView style={{ height: 400, width: "100%" }}>
            <MapboxGL.Camera
              zoomLevel={zoomLevel}
              centerCoordinate={coordinates}
              animationMode="easeTo"
              animationDuration={500}
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

        {/* Confirm Button */}
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

export default MapSelect;
