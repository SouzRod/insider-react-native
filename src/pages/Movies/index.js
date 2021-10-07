import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from '@react-navigation/native';

import FavoriteItem from "../../components/FavoriteItem";
import Header from "../../components/Header";
import { getSavedMovies, deleteMovie } from '../../utils/storage';

import {
  Container,
  ListMovies
} from './style';

export default function Movies() {
  const [movies, setMovies] = useState([]);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    let isActive = true;

    async function getFavoritedMovies() {
      const result = await getSavedMovies('@primereact')
      setMovies(result);
    }

    if (isActive) {
      getFavoritedMovies();
    }

    return () => {
      isActive = false;
    };
  }, [isFocused]);

  async function handleDelete(item){
    const result = await deleteMovie('@primereact', item.id);
    setMovies(result);
  }

  function navigateDetailsPage(item) {
    navigation.navigate('Detail', { id: item.id });
  };

  return (
    <Container>
      <Header title='Meus filmes'/>

      <ListMovies
        showsVerticalScrollIndicator={false}
        data={movies}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <FavoriteItem data={item} deleteMovie={handleDelete} navigatePage={() => navigateDetailsPage(item)} />}
      />
    </Container>
  );
};