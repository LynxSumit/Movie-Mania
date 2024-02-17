import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
  Switch,
  TextInput,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import TrendingMovies from "../components/TrendingMovies";
import MovieList from "../components/MovieList";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loading from "../components/Loading";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../api/movieDb";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

const HomeScreen = () => {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();

      await auth().signOut();
      await AsyncStorage.removeItem("UserData");
      ToastAndroid.show("logged out successfully", ToastAndroid.SHORT);
      navigation.navigate("Auth");
    } catch (error) {
      console.log("Got an error");
      ToastAndroid.show("logged out successfully", ToastAndroid.SHORT);
      navigation.navigate("Auth");
    }
  };
  const getTrendingMovies = async () => {
    let data = await fetchTrendingMovies();
    setTrending(data.results);
    setLoading(false);
  };
  const getUpcomingMovies = async () => {
    let data = await fetchUpcomingMovies();
    setUpcoming(data.results);
  };
  const getTopRatedMovies = async () => {
    let data = await fetchTopRatedMovies();
    setTopRated(data.results);
  };

  useEffect(() => {
    setLoading(true);
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
    if (!route.params?.UserData) {
      navigation.navigate("Auth");
    }
  
  }, [route]);
  return (
    <View className="flex-1 bg-slate-50   dark:bg-neutral-800  ">
      {sidebarOpen ? (
        <SafeAreaView className="flex-1 w-4/5 transition-w duration-300 ease-linear items-center  bg-neutral-400  dark:bg-neutral-700 ">
          <View className="   my-3 flex-row     ">
            <Text className="font-bold text-2xl  mr-24 text-neutral-700 dark:text-white  ">
              My Activity
            </Text>
            <TouchableOpacity
              className="rounded-full mx-auto  p-2   bg-yellow-600  "
              onPress={() => setSidebarOpen(false)}
            >
              <XMarkIcon
                size={"20"}
                strokeWidth={3}
                color={"white"}
                className=""
              />
            </TouchableOpacity>
          </View>

          <Text className="text-lg  mt-4 font-semibold bg-neutral-300  dark:bg-neutral-600 px-5 py-2 text-yellow-700   dark:text-yellow-400">
            Hello , {route.params?.UserData?.displayName?.split(" ")[0]}
          </Text>
          <Image
            source={{ uri: route.params?.UserData?.photoURL }}
            className="h-20 w-20 mt-3  rounded-full "
          />
          <View className="flex-1  my-6 -ml-14  ">
            <TouchableWithoutFeedback
              className=""
              onPress={() => {
                navigation.navigate("TV Series");
                setSidebarOpen(false);
              }}
            >
              <Text className="text-lg dark:font-thin  mb-4 dark:text-neutral-100 ">
                TV Series
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("MyFavourites", {
                  userData: route.params.UserData,
                });
                setSidebarOpen(false);
              }}
              className=""
            >
              <Text className="text-lg dark:font-thin my-4 dark:text-neutral-100">
                My Favourites
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("WishList", {
                  userData: route.params.UserData,
                });
                setSidebarOpen(false);
              }}
              className=""
            >
              <Text className="text-lg dark:font-thin my-4 dark:text-neutral-100">
                My WatchList
              </Text>
            </TouchableWithoutFeedback>
            <View className="my-4 flex-row mx-auto items-center">
              <Text className="text-lg dark:font-thin  dark:text-neutral-100">
                Enable Dark Mode{" "}
              </Text>
              <TouchableOpacity className="mx-auto flex-row items-center">
                <Switch
                  trackColor={{ true: "#rgb(253 224 71)", false: "#444444" }}
                  thumbColor="#DDDDDD"
                  ios_backgroundColor="gray"
                  onValueChange={toggleColorScheme}
                  value={colorScheme == "dark"}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            className="bg-neutral-300  dark:bg-neutral-600 px-3   py-2 mx-auto   rounded-3xl my-4 items-center   "
            onPress={signOut}
          >
            <Text className="text-lg    font-bold text-yellow-700   dark:text-yellow-400">
              {" "}
              Log Out
            </Text>
          </TouchableOpacity>

          <View className='mb-2 '>
            <Text className="dark:text-white text-3xl  font-bold">
              <Text className="text-yellow-700    dark:text-yellow-400">M</Text>
              ovieMania
            </Text>
          </View>
        </SafeAreaView>
      ) : (
        <>
          <SafeAreaView className="mb-3 ">
            <StatusBar style={colorScheme == "dark" ? "light" : "dark"} />
            <View className="flex-row  justify-between items-center mx-4">
              <TouchableOpacity onPress={() => setSidebarOpen(true)}>
                <Bars3CenterLeftIcon
                  size="30"
                  strokeWidth={2}
                  color={colorScheme == "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
              <Text className=" text-3xl dark:text-neutral-200  font-bold">
                <Text className="text-yellow-700   dark:text-yellow-400">
                  M
                </Text>
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
              <TrendingMovies data={trending} />
              <MovieList title="Upcoming Movies" data={upcoming} />
              <MovieList title="Top Rated Movies" data={topRated} />
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

export default HomeScreen;
