import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSavedMovies(key) {
  const myMovies = await AsyncStorage.getItem(key);
  let savedMovies = JSON.parse(myMovies) || [];
  return savedMovies;
}

export async function saveMovie(key, newMovie) {
  const storedMovies = await getSavedMovies(key);

  const hasMovie = storedMovies.some(movie => movie.id === newMovie.id);
  if (hasMovie) return;

  storedMovies.push(newMovie);
  await AsyncStorage.setItem(key, JSON.stringify(storedMovies));
}

export async function deleteMovie(key, id) {
  let storedMovies = await getSavedMovies(key);
  storedMovies = storedMovies.filter(movie => movie.id !== id)
  await AsyncStorage.setItem(key, JSON.stringify(storedMovies));
  return storedMovies;
}

export async function hasMovie(key, movie) {
  const storedMovies = await getSavedMovies(key);
  return storedMovies.some(item => item.id === movie.id);
}
