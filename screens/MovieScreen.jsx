import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Button,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  HeartIcon,
  BookmarkIcon as BookMarkOutlined,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import {
  CheckBadgeIcon,
  BookmarkIcon as BookMarkSolid,
  ChevronLeftIcon,
  HeartIcon as HeartSolid,
} from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/Cast";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import {
  fetchMovieClips,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieSimilar,
  img1280,
} from "../api/movieDb";
import YoutubePlayer from "react-native-youtube-iframe";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

const initialState = {
  similarMovies: [],
  user: null,
  movieClips: [],
  isFavourite: false,
  loading: false,
  inWishList: false,
  movie: null,
  credits: null,
  watched: false,
  playing: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FAVOURITE":
      return { ...state, isFavourite: action.payload };
    case "SET_MOVIE":
      return { ...state, movie: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_WISHLIST":
      return { ...state, inWishList: action.payload };
    case "SET_WATCHED":
      return { ...state, watched: action.payload };
    case "SET_DETAILS":
      return { ...state, movieDetails: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CREDITS":
      return { ...state, credits: action.payload };
    case "SET_PICTURES":
      return { ...state, pictures: action.payload };
    case "SET_CLIPS":
      return { ...state, movieClips: action.payload };
    case "SET_SIMILAR":
      return { ...state, similarMovies: action.payload };
    case "SET_PLAYING":
      return { ...state, playing: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    default:
      throw new Error();
  }
}

export default function MovieScreen() {
  const { colorScheme } = useColorScheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  let { width, height } = Dimensions.get("window");
  const { params: item } = useRoute();

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      dispatch({ type: "SET_PLAYING", payload: false });
    }
  }, []);

  const fetchData = async (id) => {
    const [details, credits, similar, clips, user] = await Promise.all([
      fetchMovieDetails(id),
      fetchMovieCredits(id),
      fetchMovieSimilar(id),
      fetchMovieClips(id),
      (async () => {
        const res = await AsyncStorage.getItem("userData");
        if (res) {
          return JSON.parse(res);
        }
      })(),
    ]);

    dispatch({ type: "SET_DETAILS", payload: details });
    dispatch({ type: "SET_CREDITS", payload: credits?.cast });
    dispatch({ type: "SET_SIMILAR", payload: similar?.results });
    dispatch({ type: "SET_USER", payload: user });
    dispatch({
      type: "SET_CLIPS",
      payload: clips?.results?.filter((item, i) => i < 10),
    });
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const addToFavourite = async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      if (state.isFavourite) {
        const querySnapshot = await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("FavouriteMovies")
          .where("movieID", "==", id)
          .get();

        if (!querySnapshot.empty) {
          const docToDelete = querySnapshot.docs[0];
          await docToDelete.ref.delete();
          dispatch({ type: "SET_FAVOURITE", payload: false });
        }
      } else {
        const res = await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("FavouriteMovies")
          .add({
            movieID: id,
            movieNAME: item?.original_title,
          });
        dispatch({ type: "SET_FAVOURITE", payload: true });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const addToWishList = async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      if (state.inWishList) {
        const querySnapshot = await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("WishList")
          .where("movieID", "==", id)
          .get();

        if (!querySnapshot.empty) {
          const docToDelete = querySnapshot.docs[0];
          await docToDelete.ref.delete();
          dispatch({ type: "SET_WISHLIST", payload: false });
        }
      } else {
        const res = await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("WishList")
          .doc(state.user?.uid)
          .collection("movies")
          .add({
            movieID: id,
            movieNAME: item?.original_title,
          });
        dispatch({ type: "SET_WISHLIST", payload: true });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const addToWatched = async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      if (state.watched) {
        const querySnapshot = await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("WatchedMovies")
          .where("movieID", "==", id)
          .get();

        if (!querySnapshot.empty) {
          const docToDelete = querySnapshot.docs[0];
          await docToDelete.ref.delete();
          dispatch({ type: "SET_WATCHED", payload: false });
        }
      } else {
        const res = await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("WatchedMovies")
          .add({
            movieID: id,
            movieNAME: item?.original_title,
          });
        dispatch({ type: "SET_WATCHED", payload: true });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const myStuff = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const querySnapshot = await firestore()
        .collection("Users")
        .doc(state.user?.uid)
        .collection("FavouriteMovies")
        .get();
      const querySnapshotWatched = await firestore()
        .collection("Users")
        .doc(state.user?.uid)
        .collection("WatchedMovies")
        .get();
      const querySnapshotWishList = await firestore()
        .collection("Users")
        .doc(state.user?.uid)
        .collection("WishList")
        .doc(state.user?.uid)
        .collection("movies")
        .get();

      const movies = querySnapshot.docs.map((doc) => doc.data().movieID);
      const WatchedMovies = querySnapshotWatched.docs.map(
        (doc) => doc.data().movieID
      );
      const WishListMovies = querySnapshotWishList.docs.map(
        (doc) => doc.data().movieID
      );

      dispatch({
        type: "SET_WISHLIST",
        payload: WishListMovies.includes(item?.id),
      });
      dispatch({ type: "SET_FAVOURITE", payload: movies.includes(item?.id) });
      dispatch({
        type: "SET_WATCHED",
        payload: WatchedMovies.includes(item?.id),
      });
    } catch (error) {
      console.error("Error fetching Watchlist Movies:", error);
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  useEffect(() => {
    dispatch({ type: "SET_MOVIE", payload: item });
    if (state.movieDetails) {
      myStuff();
    }
  }, [state.movieDetails, state.user?.uid, item?.id]);

  useEffect(() => {
    fetchData(item?.id);
  }, [item?.id]);
  const navigation = useNavigation();

  return (
    <View className="flex-1   ">
      <SafeAreaView className="absolute z-20 shadow-lg   w-full mt-3 flex-row justify-between items-center px-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-xl p-1 sticky bg-yellow-500 "
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>

        <View className="    flex   flex-row rounded-xl p-1 sticky bg-yellow-600  ">
          <View className="justify-center flex-row gap-3">
            <View className="flex-row items-center     ">
              <TouchableOpacity
                onPress={() => addToFavourite(state.movieDetails?.id)}
                className="rounded-xl p-1   "
              >
                {!state.isFavourite ? (
                  <HeartIcon
                    size="26"
                    color={colorScheme == "dark" ? "#e5e5e5" : "#262626"}
                  />
                ) : (
                  <HeartSolid size="26" color={"red"} />
                )}
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center  ">
              <TouchableOpacity
                onPress={() => addToWishList(state.movieDetails?.id)}
                className="rounded-xl p-1   "
              >
                {state.inWishList ? (
                  <BookMarkSolid
                    size="20"
                    color={colorScheme == "dark" ? "#e5e5e5" : "#262626"}
                  />
                ) : (
                  <BookMarkOutlined
                    size="20"
                    color={colorScheme == "dark" ? "#e5e5e5" : "#262626"}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center  ">
              <TouchableOpacity
                onPress={() => addToWatched(state.movieDetails?.id)}
                className="rounded-xl p-1   "
              >
                {!state.watched ? (
                  <PlusCircleIcon
                    size="26"
                    color={colorScheme == "dark" ? "#e5e5e5" : "#262626"}
                  />
                ) : (
                  <CheckBadgeIcon
                    size="26"
                    color={colorScheme == "dark" ? "#e5e5e5" : "#262626"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 bg-white dark:bg-neutral-900 "
      >
        {state.loading ? (
          <Loading />
        ) : (
          <>
            <View className="w-full ">
              <View>
                <Image
                  source={{ uri: img1280(state.movieDetails?.poster_path) }}
                  style={{ width: width, height: height * 0.55 }}
                />
                <LinearGradient
                  colors={
                    colorScheme == "dark"
                      ? [
                          "transparent",
                          "rgba(23,23,23,0.8)",
                          "rgba(23,23,23,1)",
                        ]
                      : [
                          "transparent",
                          "rgba(255, 255, 255, 0.8)",
                          "rgba(255, 255, 255, 1)",
                        ]
                  }
                  style={{ width, height: height * 0.4 }}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  className="absolute bottom-0"
                />
              </View>
            </View>

            <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
              <Text className="text-neutral-500  dark:text-white  text-center mx-3   text-3xl font-bold tracking-wider ">
                {state.movieDetails?.title}
              </Text>
              <Text className="text-neutral-500   dark:text-neutral-400 font-semibold text-base text-center ">
                {state.movieDetails?.status} |{" "}
                {state.movieDetails?.release_date.split(`-`)[0]} |{" "}
                {state.movieDetails?.runtime == 0
                  ? "NA"
                  : state.movieDetails?.runtime + " min"}
              </Text>
              <ScrollView
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                horizontal
                className="flex-row border-t-2  border-neutral-400 border-b-2  py-2   mx-6 space-x-2"
              >
                {state.movieDetails?.genres?.map((genre, i) => {
                  let showDot = i + 1 != state.movieDetails?.genres?.length;
                  return (
                    <Text
                      key={i}
                      className="text-neutral-500   dark:text-neutral-400 font-semibold text-base text-center"
                    >
                      {genre?.name}
                      {showDot ? " |" : null}
                    </Text>
                  );
                })}
              </ScrollView>
              <Text className="text-xl text-neutral-500  dark:text-white mx-4 tracking-wide ">
                Overview
              </Text>
              <Text className="text-neutral-500  dark:text-neutral-400 mx-4 tracking-wide ">
                {state.movieDetails?.overview}
              </Text>
            </View>
            <View className="mt-14 -mb-10 ">
              {state.movieClips?.map((item, i) => {
                return (
                  <View key={i} className="-my-12 mx-2  p-2 -space-y-3">
                    <YoutubePlayer
                      height={height * 0.44}
                      forceAndroidAutoplay={false}
                      play={state.playing}
                      videoId={item?.key}
                      onChangeState={onStateChange}
                    />
                  </View>
                );
              })}
            </View>
            <Cast cast={state.credits} />
            <MovieList
              title="Similar Movies"
              hideSeeAll={true}
              data={state.similarMovies}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}
