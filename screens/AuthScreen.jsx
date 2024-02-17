import { View, Text, Dimensions,  ImageBackground, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AuthScreen() {
  function showToast() {
    
    ToastAndroid.show('logged in successfully!', ToastAndroid.SHORT);
  }
  const navigation = useNavigation();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
const {height, width} = Dimensions.get('window')
  // Handle user state changes
  function onAuthStateChanged(user) {
    if (initializing) setInitializing(false);
  }
 

  useEffect(() => {
    if(user){
      navigation.navigate('Home' , {UserData : user})
    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    const getUser = async () => {
      let userData = await AsyncStorage.getItem('UserData')
    setUser(JSON.parse(userData));
 
     

    }
    getUser();
    return () => subscriber(); // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  GoogleSignin.configure({
    webClientId: '271471864517-e46ndatn1e0t4l602fq4pnpvqbrjfsks.apps.googleusercontent.com',
  });

  const onGoogleButtonPress = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);

      // After successful sign-in, create a user document in Firestore
      const user = userCredential.user;
     
      await AsyncStorage.setItem('UserData' , JSON.stringify(user)); 
      await createUserDocument(user.uid, { email: user.email, displayName: user.displayName });

      // Navigate to the Home screen or perform any other logic
showToast();
      navigation.navigate('Home', {UserData :  user });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const createUserDocument = async (userUID, userData) => {
    try {
      // Check if the user document already exists
      const userDocRef = firestore().collection('Users').doc(userUID);
      const docSnapshot = await userDocRef.get();

      if (!docSnapshot.exists) {
        // Create the user document with initial data
        await userDocRef.set(userData);
        console.log('User document created successfully');
      } else {
        console.log('User document already exists');
      }
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  };

  return (
    <>
     <View
    className=' flex-1'

    style={{ width,height   }}
   
  >
  <ImageBackground
  className='flex-1 '
  source={{uri : 'https://img.freepik.com/premium-photo/abstract-white-background-with-squares_476363-1050.jpg?w=740'}}
  >

    <KeyboardAwareScrollView className='   dark:bg-yellow-800' contentContainerStyle={{ height , justifyContent: 'space-between', marginVertical: 'auto', alignItems: 'center' }}>
    <View className='flex-row gap-3 mt-24   '>
    <View className='h-16 w-16  bg-yellow-600 opacity-10 -top-28  '></View>
    <View className='h-16 w-16 bg-yellow-600 -top-14 opacity-40 '></View>
    <View className='h-16 w-16 bg-yellow-600 opacity-60'></View>
    </View>
    <View className='items-center'>

      <Text className='text-neutral-600   dark:text-white' style={{ fontSize: 30, fontWeight: 'bold' }}><Text className="text-yellow-700   dark:text-yellow-400">Movie</Text>Mania</Text>
      <View style={{ width: Dimensions.get('window').width * 0.8, alignItems: 'center', marginTop: 10 }}>
        <GoogleSigninButton onPress={ () => onGoogleButtonPress()} />
      </View>
    </View>
    <View className='flex-row gap-3 mb-24 '>
    <View className='h-16 w-16 bg-yellow-600 opacity-60'></View>
    <View className='h-16 w-16 bg-yellow-600 opacity-40 -bottom-14'></View>
    <View className='h-16 w-16 bg-yellow-600 opacity-10  -bottom-28'></View>
    </View>
    </KeyboardAwareScrollView>
  </ImageBackground>
    </View>
  </>
  );
}