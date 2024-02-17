import axios from "axios";
import firestore from "@react-native-firebase/firestore";

import { API_SECRET } from "../constant";
const baseUrl = `https://api.themoviedb.org/3`;
const trendingMovieEndPoint = `${baseUrl}/trending/movie/day?api_key=${API_SECRET}`;
const airingTodayTVSeriesEndPoint = `https://api.themoviedb.org/3/tv/airing_today?api_key=${API_SECRET}`;
const onTheAirTVSeriesEndPoint = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_SECRET}`;
const popularTVSeriesEndPoint = `https://api.themoviedb.org/3/tv/popular?api_key=${API_SECRET}`;
const topRatedTVSeriesEndPoint = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_SECRET}`;
const upcomingMovieEndPoint = `${baseUrl}/movie/upcoming?api_key=${API_SECRET}`;
const topRatedMovieEndPoint = `${baseUrl}/movie/top_rated?api_key=${API_SECRET}`;
const searchMoviesEndPoint = `${baseUrl}/search/movie?api_key=${API_SECRET}`;
const masterSearchEndpoint = `https://api.themoviedb.org/3/search/multi?api_key=${API_SECRET}`;
export const img500 = (path) => {
  return `https://image.tmdb.org/t/p/w500${path}`;
};
export const img342 = (path) => {
  return `https://image.tmdb.org/t/p/w342${path}`;
};
export const img185 = (path) => {
  return `https://image.tmdb.org/t/p/w185${path}`;
};
export const img1280 = (path) => {
  return `https://image.tmdb.org/t/p/w1280${path}`;
};

const apiCall = async (endpoint, params) => {
  let options = {
    method: "GET",
    url: endpoint,
    params: params ? params : {},
  };

  try {
    const res = await axios.request(options);
    return res.data;
  } catch (error) {
    console.log(error.message);
    return {};
  }
};

export const fetchTrendingMovies = () => {
  return apiCall(trendingMovieEndPoint);
};
export const fetchUpcomingMovies = () => {
  return apiCall(upcomingMovieEndPoint);
};
export const fetchTopRatedMovies = () => {
  return apiCall(topRatedMovieEndPoint);
};
const movieDetailsEndpoint = (id) =>
  `https://api.themoviedb.org/3/movie/${id}?api_key=${API_SECRET}`;
const movieCreditsEndpoint = (id) =>
  `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_SECRET}`;
const similarMoviesEndpoint = (id) =>
  `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_SECRET}`;
const personDetailsEndpoint = (id) =>
  `https://api.themoviedb.org/3/person/${id}?api_key=${API_SECRET}`;
const personMoviesEndpoint = (id) =>
  `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_SECRET}`;
const moviesClipsEndpoint = (id) =>
  `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_SECRET}`;
const personImagesEndpoint = (id) =>
  `https://api.themoviedb.org/3/person/${id}/images?api_key=${API_SECRET}`;
const TVSeriesDetailsEndpoint = (id) =>
  `https://api.themoviedb.org/3/tv/${id}?api_key=${API_SECRET}`;
const TVSeriesCreditsEndpoint = (id) =>
  `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_SECRET}`;
const similarTVSeriesEndpoint = (id) =>
  `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_SECRET}`;
const TVSeriesImagesEndpoint = (id) =>
  `https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_SECRET}`;
const TVSeriesClipsEndpoint = (id) =>
  `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_SECRET}`;
export const fetchMovieDetails = (id) => {
  return apiCall(movieDetailsEndpoint(id));
};
export const fetchMovieCredits = (id) => {
  return apiCall(movieCreditsEndpoint(id));
};
export const fetchMovieSimilar = (id) => {
  return apiCall(similarMoviesEndpoint(id));
};
export const fetchPersonDetails = (id) => {
  return apiCall(personDetailsEndpoint(id));
};
export const fetchPersonMovies = (id) => {
  return apiCall(personMoviesEndpoint(id));
};
export const fetchMovieClips = (id) => {
  return apiCall(moviesClipsEndpoint(id));
};
export const fetchPersonImages = (id) => {
  return apiCall(personImagesEndpoint(id));
};
export const fetchTVSeriesDetails = (id) => {
  return apiCall(TVSeriesDetailsEndpoint(id));
};
export const fetchTVSeriesCredits = (id) => {
  return apiCall(TVSeriesCreditsEndpoint(id));
};
export const fetchSearchedMovies = (params) => {
  return apiCall(searchMoviesEndPoint, params);
};
export const masterSearch = (params) => {
  return apiCall(masterSearchEndpoint, params);
};
export const fetchAiringTodayTVSeries = () => {
  return apiCall(airingTodayTVSeriesEndPoint);
};
export const fetchOnTheAirTVSeries = () => {
  return apiCall(onTheAirTVSeriesEndPoint);
};
export const fetchPopularTVSeries = () => {
  return apiCall(popularTVSeriesEndPoint);
};
export const fetchTopRatedTVSeries = () => {
  return apiCall(topRatedTVSeriesEndPoint);
};
export const fetchSimilarTVSeries = (id) => {
  return apiCall(similarTVSeriesEndpoint(id));
};
export const fetchTVSeriesImages = (id) => {
  return apiCall(TVSeriesImagesEndpoint(id));
};
export const fetchTVSeriesClips = (id) => {
  return apiCall(TVSeriesClipsEndpoint(id));
};

export const getWatchedMovies = async (id) => {
  let data = [];
  try {
    const watchedRef = await firestore()
      .collection("Users")
      .doc(id)
      .collection("WatchedMovies")
      .get();
    const watchedArray = watchedRef.docs.map((doc) => doc.data().movieID);
    await Promise.all(
      watchedArray.map(async (movie) => {
        let movieRes = await fetchMovieDetails(movie);
        data.push(movieRes);
      })
    );

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};
export const getWatchedShows = async (id) => {
  let data = [];
  try {
    const watchedRef = await firestore()
      .collection("Users")
      .doc(id)
      .collection("WatchedShows")
      .get();
    const watchedArray = watchedRef.docs.map((doc) => doc.data().showId);
    await Promise.all(
      watchedArray.map(async (movie) => {
        let movieRes = await fetchTVSeriesDetails(movie);
        data.push(movieRes);
      })
    );

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};

export const getWishListMovies = async (id) => {
  let data = [];
  try {
    const watchedRef = await firestore()
      .collection("Users")
      .doc(id)
      .collection("WishList")
      .doc(id)
      .collection("movies")
      .get();
    const watchedArray = watchedRef.docs.map((doc) => doc.data().movieID);
    await Promise.all(
      watchedArray.map(async (movie) => {
        let movieRes = await fetchMovieDetails(movie);
        data.push(movieRes);
      })
    );

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};
export const getWishListShows = async (id) => {
  let data = [];
  try {
    const watchedRef = await firestore()
      .collection("Users")
      .doc(id)
      .collection("WishList")
      .doc(id)
      .collection("shows")
      .get();
    const watchedArray = watchedRef.docs.map((doc) => doc.data().showId);
    await Promise.all(
      watchedArray.map(async (movie) => {
        let movieRes = await fetchTVSeriesDetails(movie);
        data.push(movieRes);
      })
    );

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};
export const getFavouriteMovies = async (id) => {
  let data = [];
  try {
    const watchedRef = await firestore()
      .collection("Users")
      .doc(id)
      .collection("FavouriteMovies")
      .get();
    const watchedArray = watchedRef.docs.map((doc) => doc.data().movieID);
    console.log(watchedArray);
    await Promise.all(
      watchedArray.map(async (movie) => {
        let movieRes = await fetchMovieDetails(movie);
        data.push(movieRes);
      })
    );

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};
export const getFavouriteShows = async (id) => {
  let data = [];
  try {
    const watchedRef = await firestore()
      .collection("Users")
      .doc(id)
      .collection("FavouriteShows")
      .get();
    const watchedArray = watchedRef.docs.map((doc) => doc.data().showId);
    await Promise.all(
      watchedArray.map(async (movie) => {
        let movieRes = await fetchTVSeriesDetails(movie);
        data.push(movieRes);
      })
    );

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};
export const getFavouriteCelebs = async (id) => {
  let data = [];
  try {
    const watchedRef = await firestore()
      .collection("Users")
      .doc(id)
      .collection("FavouriteCelebs")
      .get();
    const watchedArray = watchedRef.docs.map((doc) => doc.data().celebrityId);
    await Promise.all(
      watchedArray.map(async (movie) => {
        let persons = await fetchPersonDetails(movie);
        data.push(persons);
      })
    );

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};

export const isFavouriteCheck = async (id, item) => {
  try {
    const querySnapshotFav = await firestore()
      .collection("Users")
      .doc(id)
      .collection("FavouriteMovies")
      .get();
    const Favmovies = await querySnapshotFav.docs.map(
      (doc) => doc.data().movieID
    );

    return Favmovies.includes(item?.id);
  } catch (error) {
    console.error("Error fetching favorite  : ", error);
  }
};
export const IsWatchedCheck = async (id, item) => {
  try {
    const querySnapshotWatched = await firestore()
      .collection("Users")
      .doc(id)
      .collection("WatchedMovies")
      .get();
    const Watchedmovies = await querySnapshotWatched.docs.map(
      (doc) => doc.data().movieID
    );

    return Watchedmovies.includes(item?.id);
  } catch (error) {
    console.error("Error fetching  wishList :", error);
  }
};
export const inWishListCheck = async (id, item) => {
  try {
    const querySnapshotWishList = await firestore()
      .collection("Users")
      .doc(id)
      .collection("WishList")
      .doc(id)
      .collection("movies")
      .get();
    const WishListmovies = await querySnapshotWishList.docs.map(
      (doc) => doc.data().movieID
    );
    return WishListmovies.includes(item?.id);
  } catch (error) {
    console.error("Error fetching  wishList :", error);
  }
};
// setInWishList(WishListmovies.includes(item?.id));
// setWatched(Watchedmovies.includes(item?.id));
