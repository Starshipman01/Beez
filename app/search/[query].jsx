import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  // const onRefresh = async () => {
  //   setRefreshring(true);
  //   //recall videos
  //   await refetch();
  //   setRefreshing(false);
  //   console.log(posts);
  //   console.log();
  // };
  // const { isLoggedIn, user } = useGlobalContext();
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        // data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          // <Text className="text-3xl text-white">{item.title}</Text>
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results:
            </Text>

            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput
                initialQuery={query}
                placeholder="Search for a Video Topic"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;

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
