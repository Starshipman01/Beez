import { View, Text, Alert } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { DatetimeBar } from "../../components/DateTimeBar";
import { useLocalSearchParams } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useRequest } from "../../context/RequestContext";
import { createNewDelivery } from "../../lib/appwrite";

const SubmitRequest = () => {
  const { user, token } = useGlobalContext();
  const [uploading, setUploading] = useState(false);

  const { requestData, setRequestData } = useRequest();
  const defaultForm = {
    dropOffAddress: "",
    dropOffCoordinates: {
      latitude: 0,
      longitude: 0,
    },
    dropOffRange: 0,
  };

  const [form, setForm] = useState(defaultForm);
  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useFocusEffect(
    useCallback(() => {
      setForm({
        dropOffAddress: requestData.dropOffAddress,
        dropOffCoordinates: {
          latitude: requestData.dropOffCoordinates.latitude,
          longitude: requestData.dropOffCoordinates.longitude,
        },
        dropOffRange: requestData.dropOffRange,
      });
      return () => {
        console.log("Saving form to context before leaving submitRequest");
        console.log("FORM: ", formRef.current);
        setRequestData(formRef.current);
      };
    }, [])
  );

  const handleDropOffAddress = () => {
    console.log("PASSING FROM submitrequest to maprequest");
    console.log("Going to /maprequest with", form);
    setRequestData(form);
    setTimeout(() => {
      router.push({
        pathname: "/mapRequest",
      });
    }, 500); // 50ms is enough, just gives React a breath
  };

  const submit = async () => {
    console.log("FINAL FORM: ", form);
    if (!form.dropOffAddress) {
      return Alert.alert("Missing fields", `Delivery Addresss is Blank`);
    }

    try {
      const packet = {
        userId: user.$id,
        dropOffAddress: form.dropOffAddress,
        dropOffCoordinates: form.dropOffCoordinates,
        dropOffRange: form.dropOffRange,
        token: token,
      };
      console.log("FINAL SUBMISSIONS: ", packet);
      //await createNewDelivery(packet); //TESTING HERE

      Alert.alert("Success", "Order Created Successfully");
      router.push("/home");
    } catch (error) {
      console.log("Error in Submit", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Look for Deliveries
        </Text>

        <View className="space-y-2 mt-5">
          <Text className="text-base text-gray-100 font-pmedium text-left">
            Drop Off Address
          </Text>
          <View className="flex flex-row gap-4">
            <View className="flex-1 border-2 border-black-500 h-16 px-4 bg-black-100 rounded-2xl items-center justify-center">
              <Text className="text-white font-psemibold text-base">
                {form.dropOffAddress}
              </Text>
            </View>

            <CustomButton
              title="Drop Off"
              handlePress={handleDropOffAddress}
              containerStyles="border-2 border-black-500 w-1/3 h-16 px-4 bg-black-100 rounded-2xl items-center flex-row"
            />
          </View>
        </View>

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubmitRequest;
