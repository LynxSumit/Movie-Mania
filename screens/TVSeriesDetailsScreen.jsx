import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useReducer } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  HeartIcon as HeartSolid,
  BookmarkIcon as BookMarkSolid,
  CheckBadgeIcon,
} from "react-native-heroicons/solid";
import {
  HeartIcon,
  BookmarkIcon as BookMarkOutlined,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import Loading from "../components/Loading";
import {
  fetchSimilarTVSeries,
  fetchTVSeriesClips,
  fetchTVSeriesCredits,
  fetchTVSeriesDetails,
  fetchTVSeriesImages,
  img1280,
  img500,
} from "../api/movieDb";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/Cast";
import YoutubePlayer from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { useColorScheme } from "nativewind";

const initialState = {
  isFavourite: false,
  user: null,
  openToggleMenu: false,
  inWishList: false,
  watched: false,
  seriesDetails: null,
  loading: false,
  credits: [],
  pictures: [],
  tvSeriesClips: [],
  similar: [],
  playing: false,
  mode: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FAVOURITE":
      return { ...state, isFavourite: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_TOGGLE_MENU":
      return { ...state, openToggleMenu: action.payload };
    case "SET_WISHLIST":
      return { ...state, inWishList: action.payload };
    case "SET_WATCHED":
      return { ...state, watched: action.payload };
    case "SET_DETAILS":
      return { ...state, seriesDetails: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CREDITS":
      return { ...state, credits: action.payload };
    case "SET_PICTURES":
      return { ...state, pictures: action.payload };
    case "SET_CLIPS":
      return { ...state, tvSeriesClips: action.payload };
    case "SET_SIMILAR":
      return { ...state, similar: action.payload };
    case "SET_PLAYING":
      return { ...state, playing: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    default:
      throw new Error();
  }
}

export default function TVSeriesDetailsScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { height, width } = Dimensions.get("window");
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const { params: item } = useRoute();

  const fetchData = async (id) => {
    const [details, credits, similar, pictures, clips, user] = await Promise.all([
      fetchTVSeriesDetails(id),
      fetchTVSeriesCredits(id),
      fetchSimilarTVSeries(id),
      fetchTVSeriesImages(id),
      fetchTVSeriesClips(id),
      ( async () => { const res = await AsyncStorage.getItem('userData'); if(res){ return JSON.parse(res) } } )()
    ]);

    dispatch({ type: "SET_DETAILS", payload: details });
    dispatch({ type: "SET_CREDITS", payload: credits?.cast });
    dispatch({ type: "SET_SIMILAR", payload: similar?.results });
    dispatch({ type: "SET_USER", payload: user });
    dispatch({
      type: "SET_PICTURES",
      payload: pictures?.backdrops?.filter((item, i) => i < 10),
    });
    dispatch({
      type: "SET_CLIPS",
      payload: clips?.results?.filter((item, i) => i < 10),
    });
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const addToWishList = async (id) => {

    try {
    
      if (state.inWishList) {
        // If the movie is already a favorite, remove it from the 'FavouriteMovies' collection
        const querySnapshot = await firestore()
        .collection('Users').doc(state.user?.uid).collection('WishList').doc(state.user?.uid).collection("shows")
          .where('showId', '==', id)
          .get();
  
        if (!querySnapshot.empty) {
          // Assuming there's only one document with the same movie ID
          const docToDelete = await  querySnapshot.docs[0];
          await docToDelete.ref.delete();
          dispatch({ type: "SET_WISHLIST", payload: false })} } else {
             // If the movie is not a favorite, add it to the 'FavouriteMovies' collection
             const res = await firestore().collection('Users').doc(state.user?.uid).collection('WishList').doc(state.user?.uid).collection("shows").add({ showId: id, showName : item?.name }); dispatch({ type: "SET_WISHLIST", payload: true });
            }
           
          } catch (error) {
            console.error('Error:', error);
            
          }
        };
  const addToWatched = async (id) => {
    try {
      if (state.watched) {
        const querySnapshot = await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("WatchedShows")
          .where("showId", "==", id)
          .get();

        if (!querySnapshot.empty) {
          // Assuming there's only one document with the same movie ID
          const docToDelete =  querySnapshot.docs[0];
          await docToDelete.ref.delete();
          dispatch({ type: "SET_WATCHED", payload: false });
        }
      } else {
        await firestore()
          .collection("Users")
          .doc(state.user?.uid)
          .collection("WatchedShows")
          .add({ showId: id, showNAME: item?.name });
        dispatch({ type: "SET_WATCHED", payload: true });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addToFavourite = async (id) => {

  try {
  
    if (state.isFavourite) {
   
      const querySnapshot = await firestore()
      .collection('Users').doc(state.user?.uid).collection('FavouriteShows')
        .where('showId', '==', id)
        .get();

      if (!querySnapshot.empty) {
        // Assuming there's only one document with the same movie ID
        const docToDelete =   querySnapshot.docs[0];
        await docToDelete.ref.delete();
        dispatch({type :  'SET_FAVOURITE', payload : false});
     
    } } else { // If the movie is not a favorite, add it to the 'FavouriteMovies' collection
       
          const res = await firestore().collection('Users').doc(state.user?.uid).collection('FavouriteShows').add({ showId: id, showName : state.seriesDetails?.original_name }); 
           dispatch({type :  'SET_FAVOURITE', payload : true});
}

} catch (error) {
console.error('Error:', error);

}
};

const myStuff = async () => {
  dispatch({type : 'SET_LOADING', payload : true})
  try {
    const querySnapshot = await firestore()
    .collection('Users')
    .doc(state.user?.uid)
    .collection('FavouriteShows')
    .get();
    const querySnapshotWatched = await firestore()
    .collection('Users')
    .doc(state.user?.uid)
    .collection('WatchedShows')
    .get();
    const querySnapshotWishList = await firestore()
    .collection('Users')
    .doc(state.user?.uid)
    .collection('WishList')
    .doc(state.user?.uid)
    .collection('shows')
    .get();
    
    const shows = querySnapshot.docs.map(doc => doc.data().showId);
    const Watchedshows = querySnapshotWatched.docs.map(doc => doc.data().showId);
    const WishListshows = querySnapshotWishList.docs.map(doc => doc.data().showId);
    
    dispatch({ type: 'SET_WISHLIST', payload: WishListshows.includes(item?.id) });
    dispatch({ type: 'SET_FAVOURITE', payload: shows.includes(item?.id) });
    dispatch({ type: 'SET_WATCHED', payload: Watchedshows.includes(item?.id) });
  } catch (error) {
    console.error('Error fetching Watchlist Shows shows:', error);
  }

  dispatch({type : 'SET_LOADING', payload : false})
};

useEffect(() => {
  if (state.seriesDetails) {
    myStuff();
  }
}, [state.seriesDetails, state.user?.uid, item?.id]);


useEffect(() => {
  fetchData(item?.id);
}, [item?.id]);


// hello 

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);
  return (
    <View className="flex-1  ">
      <SafeAreaView className="absolute z-20 shadow-lg  bg-new w-full mt-3 flex-row justify-between items-center px-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-xl p-1 sticky bg-yellow-500 "
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <View>
          <View className="    flex   flex-row rounded-xl p-1 sticky bg-yellow-600  ">
            <View className="justify-center flex-row gap-3">
              <View className="flex-row items-center     ">
                <TouchableOpacity
                  onPress={() => addToFavourite(item?.id)}
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
                  onPress={() => addToWishList(item?.id)}
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
                  onPress={() => addToWatched(item?.id)}
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
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 bg-white dark:bg-neutral-900"
      >
        {state.loading ? (
          <Loading />
        ) : (
          <>
            <View className="w-full ">
              <View>
                <Image
                  source={{ uri: img1280(state.seriesDetails?.backdrop_path) }}
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
              <Text className=" text-neutral-500  dark:text-white text-center text-3xl font-bold tracking-wider ">
                {state.seriesDetails?.name}
              </Text>
              <Text className="text-neutral-500  dark:text-white font-semibold text-base text-center ">
                {state.seriesDetails?.status} | since{" "}
                {state.seriesDetails?.first_air_date.split(`-`)[0]}
              </Text>
              <ScrollView
                contentContainerStyle={{
                  alignItems: "center",
                  marginHorizontal: "auto",
                }}
                horizontal
                className="flex-row border-t-2 border-neutral-400 border-b-2  py-2   mx-6 space-x-2"
              >
                {state.seriesDetails?.genres?.map((genre, i) => {
                  let showDot = i + 1 != state.seriesDetails?.genres?.length;
                  return (
                    <Text
                      key={i}
                      className="text-neutral-500  dark:text-white font-semibold text-base text-center"
                    >
                      {genre?.name}
                      {showDot ? " |" : null}
                    </Text>
                  );
                })}
              </ScrollView>
              <Text className='text-xl text-neutral-500  dark:text-white mx-4 tracking-wide '>Overview</Text>
              <Text className="text-neutral-500  dark:text-white mx-4 tracking-wide ">
            
                {state.seriesDetails?.overview}
              </Text>
            </View>
            <View className="mt-14 -mb-10 ">
              {state.tvSeriesClips?.map((item, i) => {
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
            <View className="my-2 flex-wrap flex-row gap-2  mx-auto">
              {state.pictures &&
                state.pictures.map((item, i) => {
                  return (
                    <Image
                      className="my-3 "
                      style={{
                        height: height * 0.2,
                        width: width * 0.46,
                        borderRadius: 5,
                      }}
                      key={i}
                      source={{ uri: img1280(item?.file_path) }}
                    />
                  );
                })}
            </View>
            <Cast cast={state.credits} />
            <View className="mx-3 ">
              <Text className="text-xl text-neutral-800   dark:text-neutral-300 px-3 py-2 font-semibold ">
                Similar Shows
              </Text>
              <FlatList
                horizontal
                data={state.similar}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.push("TVSeriesDetails", item)}
                  >
                    <View className="space-y-1 mx-2   ">
                      <Image
                        source={{ uri: img500(item?.poster_path) }}
                        className="rounded-t-lg  "
                        style={{ width: width * 0.38, height: height * 0.32 }}
                      />
                      <Text className=" text-center text-clip ml-1">
                        {item?.name?.length > 14
                          ? item?.name?.slice(0, 14) + "..."
                          : item?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
