import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { img1280 } from "../api/movieDb";

export default function MovieListScreen() {
  const { height, width } = Dimensions.get("window");
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View className="flex-1 dark:bg-neutral-800  ">
      <SafeAreaView className=" z-20 w-full my-3  flex-row justify-between items-center px-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-xl p-1 bg-yellow-500 "
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>

        <Text className="text-lg dark:text-neutral-200   font-bold ">
          <Text className="text-yellow-700   dark:text-yellow-400 text-2xl">
            All
          </Text>{" "}
          {route.params?.title}
        </Text>
      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row justify-between flex-wrap mx-2 my-4 ">
          {route.params.data &&
            route.params.data?.map((itemm, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", itemm)}
                >
                  <View className="space-y-2 mb-4">
                    {itemm?.poster_path ? (
                      <Image
                        className="rounded-t-lg  bg-neutral-500"
                        style={{ height: height * 0.3, width: width * 0.44 }}
                        source={{ uri: img1280(itemm?.backdrop_path) }}
                      />
                    ) : (
                      <Image
                        className="rounded-t-lg "
                        style={{ height: height * 0.3, width: width * 0.44 }}
                        source={{
                          uri: "https://t3.ftcdn.net/jpg/00/62/26/78/240_F_62267871_t1n8LSkrFSL2t1aQSyilyfVpC21wQx59.jpg",
                        }}
                      />
                    )}
                    <Text className="dark:text-neutral-200 ml-1 text-center text-sm ">
                      {itemm?.title?.length > 22
                        ? itemm?.title?.slice(0, 22) + "..."
                        : itemm?.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}
