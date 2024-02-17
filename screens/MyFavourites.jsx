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
import {  ChevronLeftIcon} from "react-native-heroicons/solid";
import {  } from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import {
  fetchMovieDetails,
  fetchPersonDetails,
  fetchTVSeriesDetails,
  getFavouriteCelebs,
  getFavouriteMovies,
  getFavouriteShows,
  img1280,
  img342,
  img500,
} from "../api/movieDb";
import Loading from "../components/Loading";

export default function MyFavourites() {
  const route = useRoute()
  const { height, width } = Dimensions.get("window");
  const [user, setUser] = useState(null);
  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const [favouriteTV, setFavouriteTV] = useState([]);
  const [favouriteCelebs, setFavouriteCelebs] = useState([]);
const [loading, setLoading] = useState(false);
const fetchFavouriteMovies = async () => {
  setLoading(true)
  const res  = await getFavouriteMovies(user?.uid);
  setLoading(false)
  setFavouriteMovies(res);
}
const fetchFavouriteShows = async () => {
  setLoading(true)
  const res  = await getFavouriteShows(user?.uid);
  setLoading(false)
  setFavouriteTV(res);
}
const fetchFavouriteCelebs = async () => {
  setLoading(true)
  const res  = await getFavouriteCelebs(user?.uid);
  setLoading(false)
  setFavouriteCelebs(res);
}
console.log(user)
 
  useEffect(() => {
    
    setUser(route.params?.userData)
setLoading(true)
    fetchFavouriteMovies();
    fetchFavouriteCelebs();
    fetchFavouriteShows();

  }, [user]);
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-slate-50   dark:bg-neutral-800 ">
      <SafeAreaView className="my-3 ">
      {/* <StatusBar style={colorScheme == 'dark' ? 'light' : 'dark'}/> */}

        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-xl p-1 sticky bg-yellow-500 "
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <Text className="dark:text-white text-3xl mx-auto  font-bold">
            <Text className="text-yellow-700   dark:text-yellow-400">M</Text>ovieMania
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} className="mx-4   ">
      {
        loading && <Loading/>
      }
      {
        favouriteMovies.length == 0 && favouriteCelebs.length == 0  && favouriteTV.length == 0 ? <View className=' my-16   items-center  self-center'><Text className='font-semibold   text-2xl my-3  text-neutral-500 '>Empty Favorites 😟</Text><TouchableOpacity onPress={() => navigation.navigate("Home", {UserData : user})} className='bg-neutral-600 rounded-sm px-3 py-1  '><Text className='text-sm font-semibold text-yellow-500   '>Explore and Add!</Text></TouchableOpacity></View> :
      
      <>
          <Text className="text-2xl  font-semibold text-center  my-4 border-b-[1px] py-2   mx-auto  dark:text-neutral-200 border-neutral-400   "> Favourites</Text>
      {

        favouriteMovies.length > 0 &&

        <View className="my-2">
          <Text className="text-lg  font-thin dark:text-neutral-200  "> Movies</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            className=""
            data={favouriteMovies}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("Movie", item)}
                >
                  <View className="mx-3 my-3">
                    <Image
                      className="rounded-t-lg"
                      style={{ width: width * 0.52, height: height * 0.32 }}
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
      }
      {
      favouriteTV.length > 0 && 
        <View className="my-2">
          <Text className="text-lg  font-thin dark:text-neutral-200 ">  TV Series</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            className=""
            data={favouriteTV}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("TVSeriesDetails", item)}
                >
                  <View className="mx-3 my-3">
                    <Image
                      className="rounded-t-lg"
                      style={{ width: width * 0.52, height: height * 0.32 }}
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
      }
      {

      favouriteCelebs.length > 0 &&
        <View className="my-2">
          <Text className="text-lg  font-thin dark:text-neutral-200">
            {" "}
             Celebreties
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            className=""
            data={favouriteCelebs}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("Person", item)}
                >
                  <View className="mx-3 my-3">
                    <Image
                      className="rounded-full"
                      style={{ width: width*.36, height: height * 0.20 }}
                      source={{ uri: img342(item?.profile_path) }}
                    />
                    <Text className="text-center font-semibold text-sm  px-4  py-2 dark:text-neutral-200">
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
      }
      </>
      }
      </ScrollView>
    </View>
  );
}
