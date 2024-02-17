import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getWatchedMovies,
  getWatchedShows,
  getWishListMovies,
  getWishListShows,
  img1280,
  img342,
  img500,
} from "../api/movieDb";
import Loading from "../components/Loading";
import { useColorScheme } from "nativewind";

export default function WishListScreen() {
  const { colorScheme } = useColorScheme();
  const route = useRoute();
  const { height, width } = Dimensions.get("window");
  const [user, setUser] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchedShows, setWatchedShows] = useState([]);
  const [wishListMovies, setWishListMovies] = useState([]);
  const [wishListShows, setWishListShows] = useState([]);
  const [loading, setLoading] = useState(false);
  let navigation = useNavigation();
  const fetchWatchedMovies = async () => {
    setLoading(true);
    const res = await getWatchedMovies(user?.uid);
    setLoading(false);
    setWatchedMovies(res);
  };
  const fetchWatchedShows = async () => {
    setLoading(true);
    const res = await getWatchedShows(user?.uid);
    setLoading(false);
    setWatchedShows(res);
  };
  const fetchWishListMovies = async () => {
    setLoading(true);
    const res = await getWishListMovies(user?.uid);
    setLoading(false);
    setWishListMovies(res);
  };
  const fetchWishListShows = async () => {
    setLoading(true);
    const res = await getWishListShows(user?.uid);
    setLoading(false);
    setWishListShows(res);
  };

  useEffect(() => {
    setUser(route.params.userData);
    setLoading(true);
    fetchWatchedShows();
    fetchWatchedMovies();
    fetchWishListMovies();
    fetchWishListShows();
  }, [user]);
  return (
    <View className="flex-1 bg-slate-50   dark:bg-neutral-800 ">
      <SafeAreaView className="my-3 ">
        <StatusBar style={colorScheme == "dark" ? "light" : "dark"} />

        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-xl p-1 sticky bg-yellow-500 "
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <Text className="dark:text-white text-3xl mx-auto  font-bold">
            <Text className="text-yellow-700   dark:text-yellow-400">M</Text>
            ovieMania
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} className="mx-4   ">
        {loading && <Loading />}
        {watchedMovies.length == 0 &&
        watchedShows.length == 0 &&
        wishListMovies.length == 0 &&
        wishListShows.length == 0 ? (
          <View className=" my-16   items-center  self-center">
            <Text className="font-semibold   text-2xl my-3  text-neutral-500 ">
              Empty WatchList😟
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home", { UserData: user })}
              className="bg-neutral-600 rounded-sm px-3 py-1  "
            >
              <Text className="text-sm font-semibold text-yellow-500   ">
                Explore and Add!
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-2xl  font-semibold text-center  my-4 border-b-[1px] py-2   mx-auto  dark:text-neutral-200 border-neutral-400   ">
              Watched
            </Text>
            {watchedMovies.length > 0 && (
              <View className="my-2">
                <Text className="text-lg  font-thin dark:text-neutral-200  ">
                  {" "}
                  Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className=""
                  data={watchedMovies}
                  renderItem={({ item }) => {
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => navigation.navigate("Movie", item)}
                      >
                        <View className="mx-3 my-3">
                          <Image
                            className="rounded-t-lg"
                            style={{
                              width: width * 0.52,
                              height: height * 0.32,
                            }}
                            source={{ uri: img1280(item?.backdrop_path) }}
                          />

                          <Text className="text-center text-sm  py-2   font-semibold rounded-b-lg w-fit  px-4  dark:text-neutral-200">
                            {item?.title?.length > 20
                              ? item?.title.slice(0, 20) + "..."
                              : item?.title}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  }}
                />
              </View>
            )}
            {watchedShows.length > 0 && (
              <View className="my-2">
                <Text className="text-lg  font-thin dark:text-neutral-200 ">
                  {" "}
                  TV Series
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className=""
                  data={watchedShows}
                  renderItem={({ item }) => {
                    return (
                      <TouchableWithoutFeedback
                        onPress={() =>
                          navigation.navigate("TVSeriesDetails", item)
                        }
                      >
                        <View className="mx-3 my-3">
                          <Image
                            className="rounded-t-lg"
                            style={{
                              width: width * 0.52,
                              height: height * 0.32,
                            }}
                            source={{ uri: img1280(item?.backdrop_path) }}
                          />
                          <Text className="text-center font-semibold text-sm py-2  rounded-b-lg w-fit  px-4   dark:text-neutral-200">
                            {item?.name?.length > 20
                              ? item?.name.slice(0, 20) + "..."
                              : item?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  }}
                />
              </View>
            )}
            <>
              <Text className="text-2xl  font-semibold text-center  my-4 border-b-[1px] py-2   mx-auto  dark:text-neutral-200 border-neutral-400   ">
                WishList
              </Text>

              {wishListMovies.length > 0 && (
                <View className="my-2">
                  <Text className="text-lg  font-thin dark:text-neutral-200  ">
                    {" "}
                    Movies
                  </Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className=""
                    data={wishListMovies}
                    renderItem={({ item }) => {
                      return (
                        <TouchableWithoutFeedback
                          onPress={() => navigation.navigate("Movie", item)}
                        >
                          <View className="mx-3 my-3">
                            <Image
                              className="rounded-t-lg"
                              style={{
                                width: width * 0.52,
                                height: height * 0.32,
                              }}
                              source={{ uri: img1280(item?.backdrop_path) }}
                            />
                            <Text className="text-center text-sm  py-2   font-semibold rounded-b-lg w-fit  px-4  dark:text-neutral-200">
                              {item?.title?.length > 20
                                ? item?.title.slice(0, 20) + "..."
                                : item?.title}
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    }}
                  />
                </View>
              )}
              {wishListShows.length > 0 && (
                <View className="my-2">
                  <Text className="text-lg  font-thin dark:text-neutral-200 ">
                    {" "}
                    TV Series
                  </Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="jk"
                    data={wishListShows}
                    renderItem={({ item }) => {
                      return (
                        <TouchableWithoutFeedback
                          onPress={() =>
                            navigation.navigate("TVSeriesDetails", item)
                          }
                        >
                          <View className="mx-3 my-3">
                            <Image
                              className="rounded-t-lg"
                              style={{
                                width: width * 0.52,
                                height: height * 0.32,
                              }}
                              source={{ uri: img1280(item?.backdrop_path) }}
                            />
                            <Text className="text-center font-semibold text-sm py-2  rounded-b-lg w-fit  px-4   dark:text-neutral-200">
                              {item?.name?.length > 20
                                ? item?.name.slice(0, 20) + "..."
                                : item?.name}
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    }}
                  />
                </View>
              )}
            </>
          </>
        )}
      </ScrollView>
    </View>
  );
}
