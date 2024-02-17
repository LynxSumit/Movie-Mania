import { View, Text, Dimensions } from 'react-native'
import React from 'react'

export default function Loading() {
    const {height } = Dimensions.get("window")
  return (
    <View style={{height}} className="flex-1 justify-center items-center h-screen">
    <Text className="text-xl text-yellow-400 font-semibold animate-spin    ">Loading...</Text>
   </View>
  )
}