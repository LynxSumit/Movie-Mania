import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { img1280 } from '../api/movieDb'

export default function MovieList({title , data,hideSeeAll}) {
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
  
    let  filteredData = [];
   for (let index = 0; index < data.length; index++) {
    if(index == 5){
      break;
    }
    filteredData.push(data[index])

    
   }   

   setFiltered(filteredData)
  }, [data]);
    const {height , width} = Dimensions.get("window")

const navigation = useNavigation()
  return (
    <View className="mb-8 space-y-4">
    <View className="mx-4 flex-row justify-between items-center">
      <Text className=" text-lg  font-bold  dark:text-neutral-200 ">{title}</Text>
<TouchableOpacity onPress={() => navigation.navigate("MovieList" , {data , title : title})}>

     <Text className="text-lg text-yellow-700   dark:text-yellow-400">See All</Text>
</TouchableOpacity>

    </View>
    {/* Movie Row */}
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{paddingHorizontal : 15}}
    
    >

    {

        filtered.map((item , index) => {
          
            return(
            <TouchableOpacity key={index} onPress={() => navigation.push("Movie", item )}>
            <View className="space-y-1 mr-4">
                
                {item?.poster_path ? (
  <Image
   className="rounded-t-lg bg-neutral-500"
            style={{width : width*.33 , height : height*.22 }}
    source={{ uri: img1280(item?.backdrop_path) }}
  />
) : (
  <Image
className="rounded-t-lg"
            style={{width : width*.33 , height : height*.22 }}
    source={{ uri: 'https://t3.ftcdn.net/jpg/00/62/26/78/240_F_62267871_t1n8LSkrFSL2t1aQSyilyfVpC21wQx59.jpg' }}
  />
)}
                <Text className="dark:text-neutral-200 text-sm text-center  ml-1">{item?.title?.length >14 ? item?.title?.slice(0,14)+ "..." : item?.title}</Text>
            </View>
            </TouchableOpacity>
            )
        })
    }

    </ScrollView>
    </View>
  )
}