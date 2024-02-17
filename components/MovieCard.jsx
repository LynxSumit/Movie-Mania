import { View, Text, TouchableWithoutFeedback, Image, Dimensions } from 'react-native'
import React from 'react'
import { img1280, img500 } from '../api/movieDb'

export default function MovieCard({item, handleClick} ) {
 
    const {height , width} = Dimensions.get("window")
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
    {
      item?.poster_path ? 
     <Image
    source={{uri : img1280(item?.poster_path)}}
    className="rounded-2xl  bg-neutral-500"
style={{
    width : width*.6,
    height : height*.4,
  borderRadius : 20
}}

     /> : <Image src='https://img.freepik.com/free-vector/flat-clapperboard-icon_1063-38.jpg?w=740&t=st=1702952760~exp=1702953360~hmac=6a9f1c7962a6c74557b20746a7c8b0dcc9dd305789db241adb8c6c9809aa31fc'
     className="rounded-t-lg"
style={{
    width : width*.6,
    height : height*.4,
  borderRadius : 20
}}
     />
    }
    </TouchableWithoutFeedback>
  )
}