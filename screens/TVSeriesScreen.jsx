import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import {
  fetchOnTheAirTVSeries,
  fetchPopularTVSeries,
  fetchTopRatedTVSeries,
} from "../api/movieDb";
import Carousel from "react-native-snap-carousel";
import MovieCard from "../components/MovieCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

export default function TVSeriesScreen() {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [current, setCurrent] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);

const {colorScheme} = useColorScheme()
  const getOnTheAir = async () => {
    const res = await fetchOnTheAirTVSeries();
    setCurrent(res.results);
    setLoading(false);
  };

  const getPopular = async () => {
    const res = await fetchPopularTVSeries();
    setPopular(res.results);
  };
  const getTopRated = async () => {
    const res = await fetchTopRatedTVSeries();
    setTopRated(res.results);
  };
  useEffect(() => {
  
    setLoading(true);
    getOnTheAir();
    getPopular();
    getTopRated();
  }, []);
  return (
    <View className="flex-1 dark:bg-neutral-800  ">
      <SafeAreaView className="my-3      ">
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4 pb-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-xl p-1 sticky bg-yellow-500 "
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <Text className="dark:text-white text-3xl  font-bold">
            <Text className="text-yellow-700   dark:text-yellow-400">M</Text>
            ovieMania
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MagnifyingGlassIcon
              size="30"
              strokeWidth={2}
              color={colorScheme == "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {current.length > 0 && (
            <View className="mb-8  ">
              <Text className="dark:text-neutral-200 mx-4 text-xl mb-4 font-bold  ">
                On The Air
              </Text>

              <Carousel
                data={current}
                renderItem={({ item }) => (
                  <MovieCard
                    item={item}
                    handleClick={() =>
                      navigation.navigate("TVSeriesDetails", item)
                    }
                  />
                )}
                firstItem={4}
                inactiveSlideOpacity={0.6}
                sliderWidth={width}
                itemWidth={width * 0.62}
                slideStyle={{ display: "flex", alignItems: "center" }}
              />
            </View>
          )}
          {popular.length > 0 && (
            <View className="mb-8  ">
              <Text className="dark:text-neutral-200 mx-4 text-xl mb-4 font-bold  ">
                Popular
              </Text>

              <Carousel
                data={popular}
                renderItem={({ item }) => (
                  <MovieCard
                    item={item}
                    handleClick={() =>
                      navigation.navigate("TVSeriesDetails", item)
                    }
                  />
                )}
                firstItem={3}
                inactiveSlideOpacity={0.6}
                sliderWidth={width}
                itemWidth={width * 0.62}
                slideStyle={{ display: "flex", alignItems: "center" }}
              />
            </View>
          )}
          {topRated.length > 0 && (
            <View className="mb-8  ">
              <Text className="dark:text-neutral-200 mx-4 text-xl mb-4 font-bold  ">
                Top Rated
              </Text>

              <Carousel
                data={topRated}
                renderItem={({ item }) => (
                  <MovieCard
                    item={item}
                    handleClick={() =>
                      navigation.navigate("TVSeriesDetails", item)
                    }
                  />
                )}
                firstItem={2}
                inactiveSlideOpacity={0.6}
                sliderWidth={width}
                itemWidth={width * 0.62}
                slideStyle={{ display: "flex", alignItems: "center" }}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
