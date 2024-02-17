import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  useColorScheme,
  Appearance,
  FlatList,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/outline";
import Loading from "../components/Loading";
import { debounce } from "lodash";
import {
  fetchSearchedMovies,
  img1280,
  img500,
  masterSearch,
} from "../api/movieDb";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SearchScreen() {
  const { height, width } = Dimensions.get("window");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [movie, setMovie] = useState([]);
  const [tV, setTV] = useState([]);
  const [celebs, setCelebs] = useState([]);
  const navigation = useNavigation();
  const handleChange = async (value) => {
    if (value?.length > 2) {
      setLoading(true);
      await masterSearch({ query: value }).then((data) => {
        setLoading(false);

        setResults(data?.results);
        let tvRes = results.filter((item) => item.media_type == "tv");
        let movieRes = results.filter((item) => item.media_type == "movie");
        let celebsRes = results.filter((item) => item.media_type == "person");
        setCelebs(celebsRes);
        setTV(tvRes);
        setMovie(movieRes);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };
  const handleCorrectly = useCallback(debounce(handleChange, 100), [
    movie,
    celebs,
    tV,
  ]);
  return (
    <SafeAreaView className="flex-1 bg-neutral-300  dark:bg-neutral-700 ">
      <KeyboardAwareScrollView
        contentContainerStyle={{ alignItems: "center" }}
        className="     "
      >
        <View className=" mb-3 flex-row my-3  justify-between items-center w-full px-8  bg-neutral-800   ">
          <TextInput
            underlineColorAndroid={"transparent"}
            onChangeText={handleCorrectly}
            placeholder="Search..."
            placeholderTextColor={"lightgrey"}
            className=" w-3/4  p-3   font-thin text-base text-neutral-200        "
          />

          <TouchableOpacity
            className="rounded-full  p-3 m-1 dark:bg-neutral-500 bg-neutral-100 "
            onPress={() => navigation.goBack()}
          >
            <XMarkIcon size="15" color={"black"} />
          </TouchableOpacity>
        </View>
        {results.length == 0 && (
          <View className="flex-col flex-1 my-16   items-center justify-center   ">
            <Image
              className="h-96 w-64 rounded-2xl "
              source={{
                uri: "https://img.freepik.com/free-vector/people-watching-movie-home_52683-40505.jpg?w=740&t=st=1702713485~exp=1702714085~hmac=cd2e563a6eb3968f228a46aed637347de884c71867b8cc19c06ac3a93fe6089d",
              }}
            />
            <Text className="text-2xl dark:text-neutral-300 my-4   ">
              No Results Found
            </Text>
          </View>
        )}
      </KeyboardAwareScrollView>

      {loading ? (
        <Loading />
      ) : (
        results?.length > 0 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            className="space-y-3"
          >
            <Text className="dark:text-white font-thin text-sm ml-1 px-4 ">
              Results{" "}
              <Text className="text-yellow-700   dark:text-yellow-400  font-semibold">
                ({results?.length})
              </Text>
            </Text>
            <View className=" justify-between flex-wrap">
              <ScrollView showsVerticalScrollIndicator={false} className="  ">
                {movie.length > 0 && (
                  <View className="my-2">
                    <Text className="text-lg font-semibold  dark:text-neutral-200">
                      {" "}
                      Movies
                    </Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className=""
                      data={movie}
                      renderItem={({ item }) => {
                        return (
                          <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("Movie", item)}
                          >
                            <View className="mx-3 my-3">
                              {item?.backdrop_path ? (
                                <Image
                                  className="rounded-t-lg  bg-neutral-500"
                                  style={{
                                    width: width * 0.52,
                                    height: height * 0.32,
                                  }}
                                  source={{ uri: img1280(item?.backdrop_path) }}
                                />
                              ) : (
                                <Image
                                  className="rounded-t-lg "
                                  style={{
                                    width: width * 0.52,
                                    height: height * 0.32,
                                  }}
                                  source={{
                                    uri: "https://t3.ftcdn.net/jpg/00/62/26/78/240_F_62267871_t1n8LSkrFSL2t1aQSyilyfVpC21wQx59.jpg",
                                  }}
                                />
                              )}

                              <Text
                                style={{ width: width * 0.52 }}
                                className="text-center font-semibold break-words   rounded-b-lg w-fit  px-4  py-2  dark:text-neutral-200"
                              >
                                {item?.title?.length > 15
                                  ? item?.title.slice(0, 15) + "..."
                                  : item?.title}
                              </Text>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      }}
                    />
                  </View>
                )}
                {tV.length > 0 && (
                  <View className="my-2">
                    <Text className="text-lg font-semibold dark:text-neutral-200  ">
                      {" "}
                      TV Series
                    </Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className=""
                      data={tV}
                      renderItem={({ item }) => {
                        return (
                          <TouchableWithoutFeedback
                            onPress={() =>
                              navigation.navigate("TVSeriesDetails", item)
                            }
                          >
                            <View className="mx-3 my-3">
                              {item?.backdrop_path ? (
                                <Image
                                  className="rounded-t-lg  bg-neutral-500"
                                  style={{
                                    width: width * 0.52,
                                    height: height * 0.32,
                                  }}
                                  source={{ uri: img1280(item?.backdrop_path) }}
                                />
                              ) : (
                                <Image
                                  className="rounded-t-lg"
                                  style={{
                                    width: width * 0.52,
                                    height: height * 0.32,
                                  }}
                                  source={{
                                    uri: "https://t3.ftcdn.net/jpg/00/62/26/78/240_F_62267871_t1n8LSkrFSL2t1aQSyilyfVpC21wQx59.jpg",
                                  }}
                                />
                              )}
                              <Text className="text-center font-semibold   rounded-b-lg w-fit  px-4  py-2 dark:text-neutral-200">
                                {item?.name?.length > 15
                                  ? item?.name.slice(0, 15) + "..."
                                  : item?.name}
                              </Text>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      }}
                    />
                  </View>
                )}
                {celebs.length > 0 && (
                  <View className="my-2">
                    <Text className="text-lg font-semibold dark:text-neutral-200  ">
                      {" "}
                      Celebreties
                    </Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className=""
                      data={celebs}
                      renderItem={({ item }) => {
                        return (
                          <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("Person", item)}
                          >
                            <View className="mx-3 my-3">
                              {item?.profile_path ? (
                                <Image
                                  className=" rounded-full bg-neutral-500"
                                  style={{
                                    width: width * 0.36,
                                    height: height * 0.18,
                                  }}
                                  source={{ uri: img500(item?.profile_path) }}
                                />
                              ) : (
                                <Image
                                  className="bg-neutral-500 rounded-full object-fill"
                                  style={{
                                    width: width * 0.36,
                                    height: height * 0.18,
                                  }}
                                  source={{
                                    uri: "https://logodix.com/logo/649370.png",
                                  }}
                                />
                              )}

                              <Text className="text-center font-semibold   w-fit px-4  py-2 dark:text-neutral-200">
                                {item?.name?.length > 15
                                  ? item?.name.slice(0, 15) + "..."
                                  : item?.name}
                              </Text>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      }}
                    />
                  </View>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        )
      )}
    </SafeAreaView>
  );
}
