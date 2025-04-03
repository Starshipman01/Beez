import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import FormField from "../../components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import MapboxGL from "@rnmapbox/maps";
import { expressKeys } from "../../lib/expressKeys";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  MapboxGL.setAccessToken(expressKeys.MAPBOX_PUBLIC_TOKEN);
  return (
    <SafeAreaView className=" bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Map Selection
        </Text>
        <View className="flex-1">
          <MapboxGL.MapView style={{ flex: 1 }}>
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={[103.8198, 1.3521]}
            />
            <MapboxGL.PointAnnotation coordinate={[103.8198, 1.3521]}>
              <View className="bg-blue-500 p-2 rounded-full">
                <Text className="text-white font-bold">📍</Text>
              </View>
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Create;
