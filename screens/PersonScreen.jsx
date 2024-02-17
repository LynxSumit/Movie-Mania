import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeartIcon,ChevronLeftIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import { fetchPersonDetails, fetchPersonImages, fetchPersonMovies, img1280, img342 } from "../api/movieDb";
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function PersonScreen() {
const [personImages, setPersonImages] = useState([]);
  const {params : item} = useRoute()
    const [personMovies, setPersonMovies] = useState([]);
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(false);
  const { height, width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [isFavourite, setIsFavourite] = useState(false);
  const [user, setUser] = useState(null);
  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id)
    if(data){
      setPerson(data)
      setLoading(false)
    }
    
  }
  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id)
    if(data){
      setPersonMovies(data?.cast)
      setLoading(false)
    }
    
  }
  const getPersonImages = async (id) => {
    const data = await fetchPersonImages(id)
    
    if(data){
      setPersonImages(data?.profiles)
      setLoading(false)
    }
    
  }

  const addToFavourite = async (id) => {
    
    try {
    
      if (isFavourite) {
        // If the movie is already a favorite, remove it from the 'FavouriteMovies' collection
        const querySnapshot = await firestore()
        .collection('Users').doc(user?.uid).collection('FavouriteCelebs')
          .where('celebrityId', '==', id)
          .get();
  
        if (!querySnapshot.empty) {
          // Assuming there's only one document with the same movie ID
          const docToDelete = await  querySnapshot.docs[0];
          await docToDelete.ref.delete();
          setIsFavourite(false);
       
console.log("Deleted")
        }
      } else {
        // If the movie is not a favorite, add it to the 'FavouriteMovies' collection
        const res = await firestore().collection('Users').doc(user?.uid).collection('FavouriteCelebs').add({
          celebrityId: id,
          name : person?.name
        });
        setIsFavourite(true);
        
        console.log('Added');
      }
     
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  (async () => {
    try {
      const querySnapshot = await firestore().collection('Users').doc(user?.uid).collection('FavouriteCelebs').get();
      const celebs = await   querySnapshot.docs.map(doc => doc.data().celebrityId);
      console.log(celebs)
console.log(celebs.includes(person?.id));
      // Check if the current movieID is in the list of favorite movies
      setIsFavourite(celebs.includes(person?.id));
    } catch (error) {
      console.error('Error fetching favorite shows:', error);
    }
  })();


  useEffect(() => {

    setLoading(true);
   
    
    (
  async () => {
  const res = await AsyncStorage.getItem('userData');
  if(res){
    setUser(JSON.parse(res))
  }
  }
)()
 getPersonImages(item?.id)
   getPersonDetails(item?.id)
   getPersonMovies(item?.id)
  
  }, [item]);
  return (
    <View className="flex-1 bg-neutral-300 dark:bg-neutral-900">
    
      <SafeAreaView className=" z-20 w-full my-3 flex-row justify-between items-center px-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-xl p-1 bg-yellow-500 "
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addToFavourite(person?.id)}
          className="rounded-xl p-1  "
        >
          <HeartIcon size="35" color={isFavourite ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>
     {
      loading ? <Loading/> : (
      <ScrollView
     
      accordion
      contentContainerStyle={{ paddingBottom: 20 }}
    >
        <View>
        <View className="flex-row justify-center my-3  ">
          <View className=" rounded-full justify-center  items-center overflow-hidden h-60 w-60  border-neutral-500 border shadow-2xl shadow-gray-400  ">
          {person?.profile_path ? (
  <Image
    style={{ height: height * 0.43, width: width * 0.74 }}
    className="rounded-2xl h-24 w-20"
    source={{ uri: img1280(person?.profile_path) }}
  />
) : (
  <Image
    style={{ height: height * 0.40, width: width * 0.74 }}
    className="rounded-2xl h-24 w-20 bg-slate-200"
    source={{ uri: 'https://logodix.com/logo/649370.png' }}
  />
)}
           
          </View>
        </View>
        <View className="mt-6 ">
          <Text className="text-3xl text-neutral-500  dark:text-white font-bold text-center">
            {person?.name}
          </Text>
          <Text className="text-base text-neutral-500  dark:text-white text-center ">
           {person?.place_of_birth}
          </Text>
        </View> 
        <View className="p-4  mx-auto  mt-6 flex-row justify-between items-center bg-neutral-100   dark:bg-neutral-700 rounded-full">
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-neutral-800 dark:text-white font-semibold">Gender</Text>
            <Text className="text-neutral-500  dark:text-white text-sm">{person?.gender == 1 ? "Female" : "Male"}</Text>
          </View>
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-neutral-800 dark:text-white font-semibold">Birthday</Text>
            <Text className="text-neutral-500  dark:text-white text-sm">{person?.birthday}</Text>
          </View>
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-neutral-800 dark:text-white font-semibold">Known for</Text>
            <Text className="text-neutral-500  dark:text-white text-sm">{person?.known_for_department}</Text>
          </View>
          <View className=" px-2 items-center">
            <Text className="text-neutral-800 dark:text-white font-semibold">Popularity</Text>
            <Text className="text-neutral-500  dark:text-white text-sm">{person?.popularity}</Text>
          </View>
        </View>
        <View className="my-6 mx-4 space-y-2">

        {
          person?.biography && <><Text className="text-neutral-800 dark:text-white text-lg  ">Biography</Text>
        <Text className="text-neutral-500  dark:text-white tracking-wide">
{person?.biography }
        </Text></>
        }

        <View className="my-2 flex-wrap flex-row gap-2 mx-auto">

        {
          personImages && personImages.map((item , i) => {
            return <Image  style={{ height: height * 0.38, width: width * 0.42 , borderRadius : 5 }}  key={i} source={{uri: img1280(item?.file_path)}}/>
          })
        }

        </View>

        </View>
        <MovieList user={user} title={`${person?.name}'s Movies `} hideSeeAll={true} data={personMovies}/>
      </View>
    </ScrollView>
      )
     }
    </View>
  );
}
