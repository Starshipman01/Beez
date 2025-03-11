import { Image, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";

import { images } from "./../constants";
import CustomButton from "./../components/CustomButton";
import { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Index() {
  const { user, isLoading, isLoggedIn } = useGlobalContext();

  // ✅ Check for isLoggedIn state constantly and redirect when needed
  // useEffect(() => {
  //   console.log("Loading:", isLoading, "Logged In:", isLoggedIn);
  //   if (!isLoading && isLoggedIn) {
  //     console.log("INDEX FUCK");
  //     router.replace("/home");
  //   }
  // }, [isLoading, isLoggedIn]); // 👈 Runs when these states change

  console.log("loading: ", isLoading);
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  console.log("login", isLoggedIn);
  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }
  // if (!isLoading && isLoggedIn) return <Redirect href="/home" />;
  else {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full justify-center items-center min-h-[85px] px-4">
            <Image
              source={images.logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
            />
            <Image
              source={images.cards}
              className="max-w-[380px] w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="relative mt-5">
              <Text className="text-4xl text-white font-bold text-center">
                Discover Endless Possibilities with{" "}
                <Text className="text-secondary-200">Aora</Text>
              </Text>
              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>
            <Text className="text-gray-100 text-sm font-pregular mt-7 text-center">
              Where creativity meets innovation: embark on a journey of
              limitless exploration with Aora
            </Text>
            <CustomButton
              title="Continue "
              handlePress={() => {
                console.log(`Logged in at handlepress ${isLoggedIn}`);
                if (isLoggedIn) {
                  router.push("/home");
                } else {
                  router.push("/sign-in");
                }
              }}
              containerStyles="w-full mt-8"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
        {/* Cant get it to work */}
      </SafeAreaView>
    );
  }
}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
// });

// <View className="flex-1 items-center justify-center bg-white">
// <Text className="text-3xl">Edit app/index.tsx to edit this screen.</Text>
// <StatusBar style="auto" />
// <Link href="/profile" style={{ color: "blue" }}>
//   Go to profile
// </Link>
// </View>
