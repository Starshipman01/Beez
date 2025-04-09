import { View, Text, Alert } from "react-native";
import React, { useState, useEffect } from "react";
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
import { useOrder } from "../../context/OrderContext";

const CreateDelivery = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);

  const { orderData, setOrderData } = useOrder();

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       // Called when navigating away
  //       console.log("Saving form to context before leaving CreateDelivery");
  //       console.log("FORM: ", form);
  //       setOrderData(form);
  //       console.log("ORDERDATA: ", orderData);
  //     };
  //   }, [form])
  // );

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
  }, [orderData]);

  const handleDropOffAddress = () => {
    console.log("PASSING FROM CREATEDELIVERY to CREATE");
    console.log("Going to /create with", form);
    setOrderData(form);
    setTimeout(() => {
      router.push({
        pathname: "/create",
      });
    }, 500); // 50ms is enough, just gives React a breath
  };

  const handleDeliveryDate = (date) => {
    setForm({ ...form, deliveryDate: date });
  };

  const handleOrderChange = (date) => {
    setForm({ ...form, orderCutOffDate: date });
  };

  const submit = async () => {
    if (
      !form.shop ||
      !form.deliveryDate ||
      !form.orderCutOffDate ||
      !form.orderCap
    ) {
      return Alert.alert(
        "Missing fields",
        `Shop: ${form.shop}, Delivery: ${form.deliveryDate}, Order Cutoff: ${form.orderCutOffDate}, Cap: ${form.orderCap}`
      );
    }

    try {
      await createDelivery({
        userId: user.$id,
        title: form.title,
        shop: form.shop,
        deliveryTime: form.deliveryDate,
        orderCutoff: form.orderCutOffDate,
        dropOffBlock: form.dropOffBlock,
        orderCap: parseInt(form.orderCap),
      });

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
          Start an Order
        </Text>

        <FormField
          title="Shop"
          value={form.shop}
          placeholder="Mcdonalds, Koi, Itea, KFC..."
          handleChangeText={(e) => setForm({ ...form, shop: e })}
          otherStyles="mt-5"
        />

        <DatetimeBar
          title="Date and Time of Delivery"
          onDateChange={handleDeliveryDate}
          value={form.deliveryDate}
        />

        <DatetimeBar
          title="Cut off time for order submission"
          onDateChange={handleOrderChange}
          value={form.orderCutOffDate}
        />

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

        <FormField
          title="Order Cap"
          value={form.orderCap}
          placeholder="Max number of orders"
          handleChangeText={(e) => setForm({ ...form, orderCap: e })}
          otherStyles="mt-5"
        />

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

export default CreateDelivery;
