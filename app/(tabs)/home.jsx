import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { RefreshControl } from "react-native-gesture-handler";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import OrderCard from "../../components/OrderCard";

const Home = () => {
  const { data: posts, refetch: refetchPosts } = useAppwrite(getAllPosts);
  // const { data: latestPosts, refetch: refetchLatest } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  const { isLoggedIn, user, setToken, token } = useGlobalContext();
  console.log(`Signin status at Home: ${user} and ${isLoggedIn}`);
  console.log(user);

  const navToLanding = async () => {
    router.replace("/");
    // router.navigate("");
  };
  const onRefresh = async () => {
    setRefreshing(true);
    //recall videos
    await refetchPosts();
    // await refetchLatest();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        // data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          // <Text className="text-3xl text-white">{item.title}</Text>
          // <VideoCard video={item} />
          <OrderCard order={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>

                <Text className="text-2xl font-psemibold text-white">
                  {user.username}
                </Text>
              </View>
              <TouchableOpacity className="mt-1.5" onPress={navToLanding}>
                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <SearchInput placeholder="Search for a Video Topic" />
            {/* <View className="w-full flex-1 pt-5 pb-8 ">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View> */}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first to upload"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;

// <Text>Home</Text>
// <CustomButton
//   title="Continue with Email"
//   handlePress={() => {
//     console.log(`Logged in Home: ${isLoggedIn} and ${user}`);
//     if (isLoggedIn) {
//       router.push("/home");
//     } else {
//       router.push("/sign-in");
//     }
//   }}
//   containerStyles="w-full mt-8"
// />
