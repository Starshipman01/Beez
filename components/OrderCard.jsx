import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";

const OrderCard = ({
  order: {
    users: { username, avatar },
    shop = "Mcdonalds",
    commision = 1,
    dropOff = "SUTD",
    cutOffTime = "5:00PM",
    deliveryTime = "6:00PM",
    orderCap = 5,
    orderId = 1,
  },
}) => {
  const [play, setPlay] = useState(false);

  const navToPlaceOrder = async () => {
    router.push({
      pathname: `/deliveryLanding?orderId=${orderId}`,
      // Passing the order information over
    });
  };

  return (
    <TouchableOpacity
      className="flex-col items-center px-4 mb-6 "
      onPress={navToPlaceOrder}
    >
      <View className="flex-row gap-3 items-start">
        <View className="justify-center item-center flex-row flex-1">
          <View className="w-[105px] h-[105px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-xl text-white font-psemibold "
              numberOfLines={1}
            >
              {shop}
            </Text>
            <Text className="text-xl text-gray-100 font-pregular">
              Dropoff at: {dropOff}
            </Text>
            <Text className="text-xl text-gray-100 font-pregular justify-right">
              Cutoff time: {cutOffTime}
            </Text>
            <Text className="text-xl text-gray-100 font-pregular">
              Delivery time: {deliveryTime}
            </Text>
          </View>
        </View>
      </View>

      {/* {play ? (
        <Video
          source={{ uri: video }} // Use one of the above sample MP4 links
          style={{ width: 208, height: 288, borderRadius: 35 }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={play}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="h-12 w-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )} */}
    </TouchableOpacity>
  );
};

export default OrderCard;
