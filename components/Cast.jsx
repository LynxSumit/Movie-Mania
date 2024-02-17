import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import { useNavigation } from '@react-navigation/native'
import {  img185, img342, img500 } from '../api/movieDb'

export default function Cast({cast}) {
    const navigation = useNavigation()
  return (
    <View className="my-6 "> 
      <Text className="  dark:text-neutral-200 text-lg mx-4 mb-5  ">Top Cast</Text>
      <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal : 15}}
      >
{cast && cast.map((person , index) => {
     
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Person", person)} key={index} className="mr-4 items-center" >
        <View className="overflow-hidden rounded-full h-20 w-20 items-center ">

        {person?.profile_path ? (
  <Image
    className="rounded-2xl h-24  bg-neutral-500 w-20"
    source={{ uri: img342(person?.profile_path) }}
  />
) : (
  <Image
    className="rounded-2xl h-24 w-20 bg-neutral-500"
    source={{ uri: 'https://logodix.com/logo/649370.png' }}
  />
)}

        </View>

<Text className="dark:text-neutral-200 text-xs mt-1">
{
    person?.character.length > 10 ? person?.character.slice(0,10) + "..." : person?.character
}

</Text>
<Text className="dark:text-neutral-200 text-xs mt-1">
{
    person?.original_name.length > 10 ? person?.original_name.slice(0,10) + "..." : person?.original_name
}

</Text>
        </TouchableOpacity>
    )
})}
      </ScrollView>
    </View>
  )
}