import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import MovieScreen from './screens/MovieScreen';
import PersonScreen from './screens/PersonScreen';
import SearchScreen from './screens/SearchScreen';
import MovieListScreen from './screens/MovieListScreen';
import TVSeriesScreen from './screens/TVSeriesScreen';
import TVSeriesDetailsScreen from './screens/TVSeriesDetailsScreen';
import AuthScreen from './screens/AuthScreen';

import 'expo-dev-client'
import MyFavourites from './screens/MyFavourites';
import WishListScreen from './screens/WishListScreen';
import { LogBox } from 'react-native';

export default function App() {
  const Stack = createNativeStackNavigator();
  LogBox.ignoreLogs([   'Non-serializable values were found in the navigation state', ]); 

  return (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Home' >
    



      <Stack.Screen name="Auth" options={{headerShown : false}} component={AuthScreen} />
 
      

      <Stack.Screen name="Home" options={{headerShown : false}} component={HomeScreen} />
      <Stack.Screen name="Movie" options={{headerShown : false}} component={MovieScreen} />
      <Stack.Screen name="Person" options={{headerShown : false}} component={PersonScreen} />
      <Stack.Screen name="MovieList" options={{headerShown : false}} component={MovieListScreen} />
      <Stack.Screen name="Search" options={{headerShown : false}} component={SearchScreen} />
      <Stack.Screen name="TV Series" options={{headerShown : false}} component={TVSeriesScreen} />
      <Stack.Screen name="TVSeriesDetails" options={{headerShown : false}} component={TVSeriesDetailsScreen} />
      <Stack.Screen name="MyFavourites" options={{headerShown : false}} component={MyFavourites} />
      <Stack.Screen name="WishList" options={{headerShown : false}} component={WishListScreen} />
      
  
    </Stack.Navigator>
  </NavigationContainer>
  );
}

