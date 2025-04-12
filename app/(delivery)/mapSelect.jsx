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
import { useOrder } from "../../context/OrderContext";

const MapSelect = () => {
  const [coordinates, setCoordinates] = useState([103.8198, 1.3521]); // Default to Singapore
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [zoomLevel, setZoomLevel] = useState(14); // Default zoom level
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const { orderData, setOrderData } = useOrder();

  const [form, setForm] = useState({
    shop: "",
    orderCap: "",
    deliveryDate: null,
    orderCutOffDate: null,
    dropOffAddress: "",
    dropOffCoordinates: {
      latitude: 0,
      longitude: 0,
    },
    dropOffRange: 0,
  });

  const [range, setRange] = useState(0);
  const [circleGeoJSON, setCircleGeoJSON] = useState(null);

  MapboxGL.setAccessToken(expressKeys.MAPBOX_PUBLIC_TOKEN);

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
    const updatedForm = { ...form, dropOffRange: range };
    setOrderData(updatedForm);
    alert(`Location confirmed: ${selectedAddress || "Custom location"}`);
    setTimeout(() => {
      router.push("/createDelivery");
    }, 50);
  };

  const generateCircleGeoJSON = (center, radiusInMeters) => {
    const points = 64;
    const coords = {
      latitude: center[1],
      longitude: center[0],
    };
    const km = radiusInMeters / 1000;
    const ret = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const dx = (km / 111.32) * Math.cos((angle * Math.PI) / 180);
      const dy = (km / 110.574) * Math.sin((angle * Math.PI) / 180);
      ret.push([coords.longitude + dx, coords.latitude + dy]);
    }
    ret.push(ret[0]);
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [ret],
          },
        },
      ],
    };
  };

  useEffect(() => {
    if (coordinates) {
      if (range > 0) {
        setCircleGeoJSON(generateCircleGeoJSON(coordinates, range));
      } else {
        setCircleGeoJSON(null);
      }

      const getZoomLevelFromRange = (r) => {
        if (r === 0) return 16.5;
        if (r <= 50) return 16;
        if (r <= 100) return 15.5;
        if (r <= 200) return 15;
        if (r <= 500) return 14.5;
        if (r <= 1000) return 13.5;
        return 13;
      };

      setZoomLevel(getZoomLevelFromRange(range));
    }
  }, [range, coordinates]);

  const deliveryRanges = [0, 50, 100, 200, 500, 1000];

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

        {/* Range Selection Bar */}
        <ScrollView
          horizontal
          className="mt-4 mb-2"
          showsHorizontalScrollIndicator={false}
        >
          {deliveryRanges.map((r) => (
            <TouchableOpacity
              key={r}
              className={`px-4 py-2 mr-2 rounded-full ${
                range === r ? "bg-blue-600" : "bg-gray-300"
              }`}
              onPress={() => setRange(r)}
            >
              <Text className={range === r ? "text-white" : "text-black"}>
                {r === 0 ? "Exact" : `${r}m`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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

            {/* Red transparent circle */}
            {circleGeoJSON && (
              <MapboxGL.ShapeSource id="circle" shape={circleGeoJSON}>
                <MapboxGL.FillLayer
                  id="circleFill"
                  style={{
                    fillColor: "rgba(255, 0, 0, 0.3)",
                    fillOutlineColor: "rgba(255, 0, 0, 0.5)",
                  }}
                />
              </MapboxGL.ShapeSource>
            )}
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
